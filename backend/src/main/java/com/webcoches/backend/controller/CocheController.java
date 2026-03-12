package com.webcoches.backend.controller;

import com.webcoches.backend.model.Coche;
import com.webcoches.backend.repository.CocheRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/coches")
public class CocheController {

    @Autowired private CocheRepository cocheRepository;

    @GetMapping
    public List<Coche> listar() { return cocheRepository.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Coche> detalle(@PathVariable Long id) {
        return cocheRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Coche crear(@RequestBody Coche coche) {
        return cocheRepository.save(coche);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Coche> actualizar(@PathVariable Long id, @RequestBody Coche cocheActualizado) {
        return cocheRepository.findById(id).map(coche -> {
            coche.setMarca(cocheActualizado.getMarca());
            coche.setModelo(cocheActualizado.getModelo());
            coche.setVersion(cocheActualizado.getVersion());
            coche.setAnio(cocheActualizado.getAnio());
            coche.setPrecio(cocheActualizado.getPrecio());
            coche.setDescripcion(cocheActualizado.getDescripcion());
            coche.setKilometros(cocheActualizado.getKilometros());
            coche.setMatriculacion(cocheActualizado.getMatriculacion());
            coche.setCombustible(cocheActualizado.getCombustible());
            coche.setPotenciaCV(cocheActualizado.getPotenciaCV());
            coche.setCilindrada(cocheActualizado.getCilindrada());
            coche.setTransmision(cocheActualizado.getTransmision());
            coche.setTipoCarroceria(cocheActualizado.getTipoCarroceria());
            coche.setNumPuertas(cocheActualizado.getNumPuertas());
            coche.setColorExterior(cocheActualizado.getColorExterior());
            coche.setColorInterior(cocheActualizado.getColorInterior());
            coche.setEstado(cocheActualizado.getEstado());
            coche.setEsNacional(cocheActualizado.getEsNacional());
            coche.setRevisionesAlDia(cocheActualizado.getRevisionesAlDia());
            coche.setGarantia(cocheActualizado.getGarantia());
            coche.setImagenUrl(cocheActualizado.getImagenUrl());
            coche.setFechaPublicacion(cocheActualizado.getFechaPublicacion());
            return ResponseEntity.ok(cocheRepository.save(coche));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!cocheRepository.existsById(id)) return ResponseEntity.notFound().build();
        cocheRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
