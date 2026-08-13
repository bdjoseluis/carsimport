package com.webcoches.backend.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Reglas de acceso de la API.
 *
 * Criterio: el catalogo es publico (cualquiera puede mirar coches y pedir
 * presupuesto), la captacion de leads es publica (reservar / vender tu coche),
 * y todo lo que es gestion interna exige rol ADMIN.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Value("${app.cors.allowed-origins:http://localhost:4200}")
    private String allowedOrigins;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Sin CSRF porque la API es stateless y se autentica con Bearer token,
            // no con cookies de sesion.
            .csrf(AbstractHttpConfigurer::disable)
            .cors(c -> c.configurationSource(corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // --- Publico: autenticacion ---
                .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()

                // --- Publico: catalogo y calculadora de presupuesto ---
                .requestMatchers(HttpMethod.GET, "/api/coches/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/importados/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/presupuesto/**").permitAll()

                // --- Publico: formularios de captacion ---
                .requestMatchers(HttpMethod.POST, "/api/reservas").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/ofertas").permitAll()

                // --- Documentacion de la API ---
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/api-docs/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()

                // --- Gestion interna: solo ADMIN ---
                .requestMatchers("/api/reservas/**").hasRole("ADMIN")
                .requestMatchers("/api/ofertas/**").hasRole("ADMIN")
                .requestMatchers("/api/importados/ingesta").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/coches/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/coches/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/coches/**").hasRole("ADMIN")

                // --- Todo lo demas exige estar autenticado ---
                .anyRequest().authenticated()
            )
            // Sin esto, Spring responde 403 tanto al que no ha iniciado sesion
            // como al que si la ha iniciado pero no tiene permisos. Para una API
            // con token hay que distinguirlos: 401 significa "identificate" y
            // 403 "estas identificado pero esto no es para ti". El front necesita
            // esa diferencia para saber si tiene que mandarte al login.
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) ->
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No autenticado"))
                .accessDeniedHandler((req, res, e) ->
                    res.sendError(HttpServletResponse.SC_FORBIDDEN, "Sin permisos"))
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Los origenes permitidos se configuran por entorno (app.cors.allowed-origins).
     * En produccion el front se sirve bajo el mismo dominio que la API, asi que
     * esta lista solo hace falta para desarrollo local.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(o -> !o.isEmpty())
                .toList());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
