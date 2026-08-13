package com.webcoches.backend.security;

import com.webcoches.backend.model.Coche;
import com.webcoches.backend.model.Reserva;
import com.webcoches.backend.repository.CocheRepository;
import com.webcoches.backend.repository.ReservaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Estos tests existen por un motivo concreto: la version anterior tenia
 * `.anyRequest().permitAll()` y el filtro JWT comentado, de forma que cualquiera
 * podia listar las reservas (con nombre, telefono y email de los clientes) o
 * borrar coches sin autenticarse.
 *
 * Si alguien vuelve a abrir la API por error, estos tests fallan.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Reglas de acceso de la API")
class ReglasDeAccesoTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private CocheRepository cocheRepository;
    @Autowired private ReservaRepository reservaRepository;

    private Long cocheId;

    @BeforeEach
    void sembrarDatos() {
        reservaRepository.deleteAll();
        cocheRepository.deleteAll();

        Coche coche = new Coche();
        coche.setMarca("Audi");
        coche.setModelo("A4");
        coche.setVersion("Avant S line");
        coche.setPrecio(28000.0);
        coche.setAnio(2021);
        coche.setCombustible("Diesel");
        coche.setTransmision("Automatica");
        coche.setTipoCarroceria("Familiar");
        coche.setEstado("Seminuevo");
        cocheId = cocheRepository.save(coche).getId();

        Reserva reserva = new Reserva();
        reserva.setCoche(coche);
        reserva.setNombre("Cliente de prueba");
        reserva.setTelefono("600000000");
        reserva.setEmail("cliente@ejemplo.com");
        reservaRepository.save(reserva);
    }

    // ── Catalogo publico ────────────────────────────────────────────────────

    @Test
    @DisplayName("el catalogo se puede consultar sin estar autenticado")
    void catalogoEsPublico() throws Exception {
        mockMvc.perform(get("/api/coches"))
               .andExpect(status().isOk());
    }

    // ── Datos personales protegidos ─────────────────────────────────────────

    @Test
    @DisplayName("listar reservas sin token devuelve 401, no los datos")
    void reservasNoSonPublicas() throws Exception {
        mockMvc.perform(get("/api/reservas"))
               .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("un usuario normal tampoco puede listar reservas")
    void reservasNoSonParaUsuariosNormales() throws Exception {
        mockMvc.perform(get("/api/reservas"))
               .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("un ADMIN si puede listar reservas")
    void reservasParaAdmin() throws Exception {
        mockMvc.perform(get("/api/reservas"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$[0].email").value("cliente@ejemplo.com"));
    }

    // ── Escritura en el catalogo ────────────────────────────────────────────

    @Test
    @DisplayName("borrar un coche sin token devuelve 401 y el coche sigue ahi")
    void borrarCocheExigeAutenticacion() throws Exception {
        mockMvc.perform(delete("/api/coches/" + cocheId))
               .andExpect(status().isUnauthorized());

        org.junit.jupiter.api.Assertions.assertTrue(
            cocheRepository.existsById(cocheId),
            "El coche no deberia haberse borrado");
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("un usuario normal no puede borrar coches")
    void borrarCocheExigeAdmin() throws Exception {
        mockMvc.perform(delete("/api/coches/" + cocheId))
               .andExpect(status().isForbidden());
    }

    // ── Formularios publicos de captacion ───────────────────────────────────

    @Test
    @DisplayName("cualquiera puede crear una reserva, pero con datos validos")
    void crearReservaEsPublicoYValidado() throws Exception {
        mockMvc.perform(post("/api/reservas")
                    .contentType("application/json")
                    .content("""
                        {"cocheId": %d, "nombre": "Ana", "telefono": "600111222",
                         "email": "ana@ejemplo.com", "comentario": "Me interesa"}
                        """.formatted(cocheId)))
               .andExpect(status().isCreated());

        // Falta el telefono -> 400, no un 500 como pasaba con el Map<String,Object>
        mockMvc.perform(post("/api/reservas")
                    .contentType("application/json")
                    .content("""
                        {"cocheId": %d, "nombre": "Ana", "email": "ana@ejemplo.com"}
                        """.formatted(cocheId)))
               .andExpect(status().isBadRequest());
    }
}
