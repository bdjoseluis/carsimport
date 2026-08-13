package com.webcoches.backend.controller;

import com.webcoches.backend.model.Usuario;
import com.webcoches.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Autenticacion y registro")
class AutenticacionTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @BeforeEach
    void sembrarAdmin() {
        usuarioRepository.deleteAll();

        Usuario admin = new Usuario();
        admin.setUsername("admin@carsimport.es");
        admin.setPassword(passwordEncoder.encode("admin-de-prueba"));
        admin.setRole("ADMIN");
        usuarioRepository.save(admin);
    }

    @Test
    @DisplayName("login correcto devuelve token y rol")
    void loginCorrecto() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                    .contentType("application/json")
                    .content("""
                        {"email":"admin@carsimport.es","password":"admin-de-prueba"}"""))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.token").isNotEmpty())
               .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    @DisplayName("contrasena incorrecta devuelve 401")
    void loginIncorrecto() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                    .contentType("application/json")
                    .content("""
                        {"email":"admin@carsimport.es","password":"la-que-no-es"}"""))
               .andExpect(status().isUnauthorized());
    }

    /**
     * Regresion del fallo mas grave que tenia el proyecto.
     *
     * Antes, /register aceptaba la entidad Usuario entera. Enviando un "id" que
     * ya existia, el save() de JPA hacia un UPDATE sobre ese usuario en lugar de
     * un INSERT: se podia sobrescribir la cuenta del administrador y quedarse
     * con ella. Ahora el DTO no tiene campo id, asi que es imposible.
     */
    @Test
    @DisplayName("el registro no puede sobrescribir un usuario existente enviando su id")
    void registroNoPuedeSecuestrarOtraCuenta() throws Exception {
        Usuario admin = usuarioRepository.findByUsername("admin@carsimport.es").orElseThrow();
        String hashOriginal = admin.getPassword();

        mockMvc.perform(post("/api/auth/register")
                    .contentType("application/json")
                    .content("""
                        {"id": %d, "username":"intruso@ejemplo.com",
                         "password":"contrasena-larga", "role":"ADMIN"}
                        """.formatted(admin.getId())))
               .andExpect(status().isCreated());

        Usuario adminDespues = usuarioRepository.findById(admin.getId()).orElseThrow();
        assertEquals("admin@carsimport.es", adminDespues.getUsername(),
            "La cuenta del admin no debe haber cambiado de nombre");
        assertEquals(hashOriginal, adminDespues.getPassword(),
            "La contrasena del admin no debe haberse sobrescrito");
        assertEquals("ADMIN", adminDespues.getRole());
    }

    @Test
    @DisplayName("el rol siempre lo decide el servidor, nunca el cliente")
    void registroIgnoraElRolEnviado() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                    .contentType("application/json")
                    .content("""
                        {"username":"nuevo@ejemplo.com","password":"contrasena-larga",
                         "role":"ADMIN"}"""))
               .andExpect(status().isCreated())
               .andExpect(jsonPath("$.role").value("USER"));

        assertEquals("USER",
            usuarioRepository.findByUsername("nuevo@ejemplo.com").orElseThrow().getRole());
    }

    @Test
    @DisplayName("no se aceptan contrasenas de menos de 8 caracteres")
    void registroValidaLaContrasena() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                    .contentType("application/json")
                    .content("""
                        {"username":"corto@ejemplo.com","password":"123"}"""))
               .andExpect(status().isBadRequest());

        assertTrue(usuarioRepository.findByUsername("corto@ejemplo.com").isEmpty());
    }

    @Test
    @DisplayName("/me sin token devuelve 401")
    void meExigeToken() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
               .andExpect(status().isUnauthorized());
    }
}
