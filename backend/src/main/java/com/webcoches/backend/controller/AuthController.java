package com.webcoches.backend.controller;

import com.webcoches.backend.model.Usuario;
import com.webcoches.backend.repository.UsuarioRepository;
import com.webcoches.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    // DTO de login
    record LoginRequest(String email, String password) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Buscamos por username (que en tu caso es el email)
        return usuarioRepository.findByUsername(request.email())
            .filter(u -> passwordEncoder.matches(request.password(), u.getPassword()))
            .map(u -> {
                String token = jwtUtil.generateToken(u.getUsername(), u.getRole());
                return ResponseEntity.ok(token); // devuelve solo el token como texto
            })
            .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByUsername(usuario.getUsername()).isPresent())
            return ResponseEntity.badRequest().body("Usuario ya existe");
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRole("USER");
        return ResponseEntity.ok(usuarioRepository.save(usuario));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        String role = jwtUtil.extractRole(token);
        return ResponseEntity.ok(Map.of("username", username, "role", role));
    }
}
