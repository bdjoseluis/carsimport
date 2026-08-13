package com.webcoches.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTOs de autenticacion.
 *
 * Importante: NUNCA se acepta la entidad Usuario directamente como @RequestBody.
 * Si se hiciera, un cliente podria enviar campos que no le corresponden (id, role)
 * y sobrescribir usuarios existentes o darse permisos de administrador.
 */
public final class AuthDtos {

    private AuthDtos() {}

    public record LoginRequest(
            @NotBlank(message = "El email es obligatorio") String email,
            @NotBlank(message = "La contrasena es obligatoria") String password) {}

    public record RegisterRequest(
            @NotBlank(message = "El usuario es obligatorio")
            @Size(max = 100, message = "El usuario no puede superar 100 caracteres")
            String username,

            @NotBlank(message = "La contrasena es obligatoria")
            @Size(min = 8, message = "La contrasena debe tener al menos 8 caracteres")
            String password) {}

    /** Respuesta de login: evita que el front tenga que pedir /me despues. */
    public record AuthResponse(String token, String username, String role) {}
}
