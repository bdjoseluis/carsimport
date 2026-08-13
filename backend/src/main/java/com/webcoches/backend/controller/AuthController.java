package com.webcoches.backend.controller;

import com.webcoches.backend.dto.AuthDtos.AuthResponse;
import com.webcoches.backend.dto.AuthDtos.LoginRequest;
import com.webcoches.backend.dto.AuthDtos.RegisterRequest;
import com.webcoches.backend.model.Usuario;
import com.webcoches.backend.repository.UsuarioRepository;
import com.webcoches.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String ROL_POR_DEFECTO = "USER";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return usuarioRepository.findByUsername(request.email())
            .filter(u -> passwordEncoder.matches(request.password(), u.getPassword()))
            .map(u -> ResponseEntity.ok(new AuthResponse(
                    jwtUtil.generateToken(u.getUsername(), u.getRole()),
                    u.getUsername(),
                    u.getRole())))
            // Mismo error tanto si el usuario no existe como si la contrasena
            // falla: no damos pistas sobre que cuentas existen.
            .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    /**
     * Registro. Solo acepta username y password: el rol lo decide el servidor,
     * siempre USER. El id ni siquiera existe en el DTO, de modo que es imposible
     * sobrescribir un usuario ya creado enviandolo en el cuerpo.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@Valid @RequestBody RegisterRequest request) {

        if (usuarioRepository.findByUsername(request.username()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El usuario ya existe"));
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(request.username());
        usuario.setPassword(passwordEncoder.encode(request.password()));
        usuario.setRole(ROL_POR_DEFECTO);

        Usuario creado = usuarioRepository.save(usuario);

        // Nunca devolvemos la entidad completa: llevaria el hash de la contrasena.
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("username", creado.getUsername(), "role", creado.getRole()));
    }

    /**
     * Datos del usuario autenticado. Los saca del contexto de seguridad que ha
     * rellenado JwtFilter, en lugar de volver a parsear la cabecera a mano.
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replaceFirst("^ROLE_", ""))
                .orElse(ROL_POR_DEFECTO);

        return ResponseEntity.ok(Map.of(
                "username", authentication.getName(),
                "role", role));
    }
}
