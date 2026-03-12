package com.webcoches.backend.controller;

import com.webcoches.backend.model.CocheImportado;
import com.webcoches.backend.repository.CocheImportadoRepository;
import com.webcoches.backend.service.IngestaCochesService;
import com.webcoches.backend.specification.CocheImportadoSpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/importados")
public class CocheImportadoController {

    @Autowired private CocheImportadoRepository cocheImportadoRepository;
    @Autowired private IngestaCochesService ingestaCochesService;

    @GetMapping
    public List<CocheImportado> listar() {
        return cocheImportadoRepository.findByActivoTrue();
    }

    @GetMapping("/{id}")
    public CocheImportado detalle(@PathVariable Long id) {
        return cocheImportadoRepository.findById(id).orElseThrow();
    }

    // Endpoint para lanzar ingesta manualmente desde Postman o panel admin
    @PostMapping("/ingesta")
    public String lanzarIngesta() {
        return ingestaCochesService.ejecutarIngesta();
    }

    @GetMapping("/filtrar")
    public ResponseEntity<List<CocheImportado>> filtrar(
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) Double precioMin,
            @RequestParam(required = false) Double precioMax,
            @RequestParam(required = false) String combustible,
            @RequestParam(required = false) String cambio) {

        Specification<CocheImportado> spec = Specification
            .where(CocheImportadoSpec.soloActivos())
            .and(CocheImportadoSpec.marcaContiene(marca))
            .and(CocheImportadoSpec.precioMinimo(
                precioMin != null ? BigDecimal.valueOf(precioMin) : null))
            .and(CocheImportadoSpec.precioMaximo(
                precioMax != null ? BigDecimal.valueOf(precioMax) : null))
            .and(CocheImportadoSpec.combustible(combustible))
            .and(CocheImportadoSpec.cambio(cambio));

        return ResponseEntity.ok(cocheImportadoRepository.findAll(spec));
    }

}
