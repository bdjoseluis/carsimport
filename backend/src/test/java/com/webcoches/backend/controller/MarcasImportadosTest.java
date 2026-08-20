package com.webcoches.backend.controller;

import com.webcoches.backend.model.CocheImportado;
import com.webcoches.backend.repository.CocheImportadoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * El endpoint /api/importados/marcas no existia: la peticion caia en /{id}, el
 * "marcas" no se podia convertir a Long y el front recibia un 401 seco. El
 * desplegable de marcas del filtro de importacion salia vacio siempre.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Marcas disponibles del catalogo de importacion")
class MarcasImportadosTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private CocheImportadoRepository repositorio;

    @BeforeEach
    void sembrarCatalogo() {
        repositorio.deleteAll();
        repositorio.save(importado("demo-a", "Audi",       true));
        repositorio.save(importado("demo-b", "Audi",       true));
        repositorio.save(importado("demo-c", "Volkswagen", true));
        repositorio.save(importado("demo-d", "Porsche",    false)); // dado de baja
    }

    @Test
    @DisplayName("las devuelve sin repetir y en orden, sin necesidad de estar logueado")
    void listaMarcas() throws Exception {
        mockMvc.perform(get("/api/importados/marcas"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.length()").value(2))
               .andExpect(jsonPath("$[0]").value("Audi"))
               .andExpect(jsonPath("$[1]").value("Volkswagen"));
    }

    @Test
    @DisplayName("no cuela las marcas de los coches dados de baja")
    void ignoraLosInactivos() throws Exception {
        mockMvc.perform(get("/api/importados/marcas"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$[?(@ == 'Porsche')]").isEmpty());
    }

    @Test
    @DisplayName("con el catalogo vacio devuelve lista vacia, no un error")
    void catalogoVacio() throws Exception {
        repositorio.deleteAll();
        mockMvc.perform(get("/api/importados/marcas"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.length()").value(0));
    }

    private CocheImportado importado(String apifyId, String marca, boolean activo) {
        CocheImportado c = new CocheImportado();
        c.setApifyId(apifyId);
        c.setFuente("autoscout24");
        c.setTitulo(marca + " de prueba");
        c.setMarca(marca);
        c.setModelo("Modelo");
        c.setPrecioOriginal(BigDecimal.valueOf(20000));
        c.setPrecioConComision(BigDecimal.valueOf(22600));
        c.setActivo(activo);
        return c;
    }
}
