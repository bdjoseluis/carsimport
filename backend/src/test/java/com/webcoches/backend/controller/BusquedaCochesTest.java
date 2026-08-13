package com.webcoches.backend.controller;

import com.webcoches.backend.model.Coche;
import com.webcoches.backend.repository.CocheRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * El endpoint /api/coches/buscar no existia: el front lo llamaba y recibia un
 * 404, asi que el buscador con filtros del catalogo nunca funciono.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Busqueda del catalogo con filtros")
class BusquedaCochesTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private CocheRepository cocheRepository;

    @BeforeEach
    void sembrarCatalogo() {
        cocheRepository.deleteAll();
        cocheRepository.save(coche("Audi", "A4", 28000.0, 2021, "Diesel", "Familiar"));
        cocheRepository.save(coche("Audi", "Q5", 41000.0, 2022, "Gasolina", "SUV"));
        cocheRepository.save(coche("Volkswagen", "Golf", 19000.0, 2019, "Gasolina", "Berlina"));
    }

    @Test
    @DisplayName("sin filtros devuelve todo el catalogo")
    void sinFiltros() throws Exception {
        mockMvc.perform(get("/api/coches/buscar"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    @DisplayName("filtra por marca sin distinguir mayusculas")
    void filtraPorMarca() throws Exception {
        mockMvc.perform(get("/api/coches/buscar").param("marca", "audi"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @DisplayName("combina varios filtros a la vez")
    void combinaFiltros() throws Exception {
        mockMvc.perform(get("/api/coches/buscar")
                    .param("marca", "Audi")
                    .param("precioMax", "30000")
                    .param("combustible", "Diesel"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.length()").value(1))
               .andExpect(jsonPath("$[0].modelo").value("A4"));
    }

    @Test
    @DisplayName("si nada encaja devuelve lista vacia, no error")
    void sinResultados() throws Exception {
        mockMvc.perform(get("/api/coches/buscar").param("marca", "Ferrari"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.length()").value(0));
    }

    private Coche coche(String marca, String modelo, Double precio, Integer anio,
                        String combustible, String carroceria) {
        Coche c = new Coche();
        c.setMarca(marca);
        c.setModelo(modelo);
        c.setVersion("");
        c.setPrecio(precio);
        c.setAnio(anio);
        c.setCombustible(combustible);
        c.setTipoCarroceria(carroceria);
        c.setTransmision("Manual");
        c.setEstado("Usado");
        return c;
    }
}
