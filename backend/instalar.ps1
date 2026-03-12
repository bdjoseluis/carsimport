# Configuración inicial
$projectRoot = Get-Location
Write-Host "Creando estructura del proyecto en: $projectRoot" -ForegroundColor Green

# Crear estructura de carpetas Maven
$dirs = @(
    "src/main/java/com/webcoches/backend/controller",
    "src/main/java/com/webcoches/backend/model",
    "src/main/java/com/webcoches/backend/repository",
    "src/main/java/com/webcoches/backend/security",
    "src/main/resources"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

# 1. Crear pom.xml
$pomContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.2</version>
        <relativePath/>
    </parent>
    <groupId>com.webcoches</groupId>
    <artifactId>backend</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>backend</name>
    <description>Backend para WebCoches</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
"@
Set-Content -Path "pom.xml" -Value $pomContent

# 2. Crear application.properties
$propContent = @"
server.port=8087
spring.datasource.url=jdbc:mysql://localhost:3306/concesionario_db?serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=joseluis
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.sql.init.mode=always
"@
Set-Content -Path "src/main/resources/application.properties" -Value $propContent

# 3. Crear data.sql
$sqlContent = @"
INSERT INTO usuarios (username, password, role) SELECT 'admin', '`$2a`$10`$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7i.f2q.Ky', 'ADMIN' WHERE NOT EXISTS (SELECT * FROM usuarios WHERE username='admin');
INSERT INTO usuarios (username, password, role) SELECT 'cliente', '`$2a`$10`$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7i.f2q.Ky', 'USER' WHERE NOT EXISTS (SELECT * FROM usuarios WHERE username='cliente');
INSERT INTO coches (marca, modelo, anio, precio, color, imagen_url, descripcion) SELECT 'Mercedes', 'Clase A', 2022, 35000.00, 'Negro', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/2018_Mercedes-Benz_A200_AMG_Line_Premium_Automatic_1.3_Front.jpg/1200px-2018_Mercedes-Benz_A200_AMG_Line_Premium_Automatic_1.3_Front.jpg', 'Compacto de lujo' WHERE NOT EXISTS (SELECT * FROM coches WHERE modelo='Clase A');
"@
Set-Content -Path "src/main/resources/data.sql" -Value $sqlContent

# 4. Clases Java - Modelos
$usuarioClass = @"
package com.webcoches.backend.model;
import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(unique = true, nullable = false) private String username;
    private String password;
    private String role;
}
"@
Set-Content -Path "src/main/java/com/webcoches/backend/model/Usuario.java" -Value $usuarioClass

$cocheClass = @"
package com.webcoches.backend.model;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
@Data
@Entity
@Table(name = "coches")
public class Coche {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String marca;
    private String modelo;
    private Integer anio;
    private BigDecimal precio;
    private String color;
    @Column(length = 1000) private String imagenUrl;
    @Column(length = 2000) private String descripcion;
}
"@
Set-Content -Path "src/main/java/com/webcoches/backend/model/Coche.java" -Value $cocheClass

# 5. Clases Java - Repositorios
$repoUser = @"
package com.webcoches.backend.repository;
import com.webcoches.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
}
"@
Set-Content -Path "src/main/java/com/webcoches/backend/repository/UsuarioRepository.java" -Value $repoUser

$repoCoche = @"
package com.webcoches.backend.repository;
import com.webcoches.backend.model.Coche;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CocheRepository extends JpaRepository<Coche, Long> {
}
"@
Set-Content -Path "src/main/java/com/webcoches/backend/repository/CocheRepository.java" -Value $repoCoche

# 6. Clases Java - Seguridad
$secConfig = @"
package com.webcoches.backend.security;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/coches").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/coches/{id}").authenticated()
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
"@
Set-Content -Path "src/main/java/com/webcoches/backend/security/SecurityConfig.java" -Value $secConfig

$userDetailService = @"
package com.webcoches.backend.security;
import com.webcoches.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;
@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired private UsuarioRepository repo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repo.findByUsername(username)
            .map(u -> new User(u.getUsername(), u.getPassword(), Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + u.getRole()))))
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }
}
"@
Set-Content -Path "src/main/java/com/webcoches/backend/security/CustomUserDetailsService.java" -Value $userDetailService

# 7. Clases Java - Controladores
$authController = @"
package com.webcoches.backend.controller;
import com.webcoches.backend.model.Usuario;
import com.webcoches.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        if(usuarioRepository.findByUsername(usuario.getUsername()).isPresent()) return ResponseEntity.badRequest().body("Existe");
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRole("USER");
        return ResponseEntity.ok(usuarioRepository.save(usuario));
    }
    @GetMapping("/login")
    public ResponseEntity<?> login(Authentication auth) { return ResponseEntity.ok("Login OK: " + auth.getName()); }
}
"@
Set-Content -Path "src/main/java/com/webcoches/backend/controller/AuthController.java" -Value $authController

$cocheController = @"
package com.webcoches.backend.controller;
import com.webcoches.backend.model.Coche;
import com.webcoches.backend.repository.CocheRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/coches")
public class CocheController {
    @Autowired private CocheRepository cocheRepository;
    @GetMapping
    public List<Coche> listar() { return cocheRepository.findAll(); }
    @GetMapping("/{id}")
    public ResponseEntity<Coche> detalle(@PathVariable Long id) {
        return cocheRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public Coche crear(@RequestBody Coche coche) { return cocheRepository.save(coche); }
}
"@
Set-Content -Path "src/main/java/com/webcoches/backend/controller/CocheController.java" -Value $cocheController

# 8. Main Application
$mainApp = @"
package com.webcoches.backend;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) { SpringApplication.run(BackendApplication.class, args); }
}
"@
Set-Content -Path "src/main/java/com/webcoches/backend/BackendApplication.java" -Value $mainApp

Write-Host "¡TODO LISTO PRIMO! Ejecuta 'mvn spring-boot:run' para arrancar." -ForegroundColor Cyan
