package com.webcoches.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);
    private static final int MIN_SECRET_LENGTH = 32; // HS256 exige 256 bits

    private final SecretKey key;
    private final long expirationMs;

    public JwtUtil(@Value("${jwt.secret:}") String secret,
                   @Value("${jwt.expiration-ms:86400000}") long expirationMs) {

        this.expirationMs = expirationMs;

        if (secret == null || secret.isBlank()) {
            // Sin secreto configurado generamos uno aleatorio en memoria: la app
            // arranca para desarrollo, pero los tokens mueren en cada reinicio.
            // En produccion JWT_SECRET es obligatorio.
            this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
            log.warn("=======================================================================");
            log.warn(" jwt.secret NO configurado. Se ha generado uno aleatorio y temporal.");
            log.warn(" Los tokens dejaran de ser validos al reiniciar la aplicacion.");
            log.warn(" Define la variable de entorno JWT_SECRET antes de desplegar.");
            log.warn("=======================================================================");
        } else if (secret.length() < MIN_SECRET_LENGTH) {
            throw new IllegalStateException(
                "jwt.secret debe tener al menos " + MIN_SECRET_LENGTH + " caracteres (tiene "
                + secret.length() + ")");
        } else {
            this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        }
    }

    public String generateToken(String username, String role) {
        Date ahora = new Date();
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(ahora)
                .setExpiration(new Date(ahora.getTime() + expirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public long getExpirationMs() {
        return expirationMs;
    }
}
