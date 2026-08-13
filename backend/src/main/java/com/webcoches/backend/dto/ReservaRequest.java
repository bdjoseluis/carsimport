package com.webcoches.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Sustituye al Map<String,Object> que se usaba antes: aquel hacia .toString()
 * sobre cada campo, asi que cualquier campo ausente reventaba con un 500.
 */
public record ReservaRequest(

        @NotNull(message = "cocheId es obligatorio")
        Long cocheId,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 120)
        String nombre,

        @NotBlank(message = "El telefono es obligatorio")
        @Size(max = 30)
        String telefono,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email no tiene un formato valido")
        String email,

        @Size(max = 1000, message = "El comentario no puede superar 1000 caracteres")
        String comentario) {
}
