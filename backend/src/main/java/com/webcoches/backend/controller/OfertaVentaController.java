package com.webcoches.backend.controller;

import com.webcoches.backend.model.OfertaVenta;
import com.webcoches.backend.repository.OfertaVentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ofertas")
public class OfertaVentaController {

    @Autowired private OfertaVentaRepository ofertaVentaRepository;

    // Crear oferta — cualquier usuario autenticado
    @PostMapping
    public ResponseEntity<OfertaVenta> crear(@RequestBody OfertaVenta oferta) {
        return ResponseEntity.ok(ofertaVentaRepository.save(oferta));
    }

    // Listar todas — solo ADMIN
    @GetMapping
    public List<OfertaVenta> listar() {
        return ofertaVentaRepository.findAllByOrderByFechaSolicitudDesc();
    }

    // Filtrar por estado — solo ADMIN
    @GetMapping("/estado/{estado}")
    public List<OfertaVenta> porEstado(@PathVariable String estado) {
        return ofertaVentaRepository.findByEstado(estado);
    }

    // Cambiar estado — solo ADMIN
    @PatchMapping("/{id}/estado")
    public ResponseEntity<OfertaVenta> cambiarEstado(@PathVariable Long id,
                                                      @RequestBody Map<String, String> body) {
        return ofertaVentaRepository.findById(id).map(o -> {
            o.setEstado(body.get("estado"));
            return ResponseEntity.ok(ofertaVentaRepository.save(o));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Añadir notas admin — solo ADMIN
    @PatchMapping("/{id}/notas")
    public ResponseEntity<OfertaVenta> actualizarNotas(@PathVariable Long id,
                                                        @RequestBody Map<String, String> body) {
        return ofertaVentaRepository.findById(id).map(o -> {
            o.setNotasAdmin(body.get("notasAdmin"));
            return ResponseEntity.ok(ofertaVentaRepository.save(o));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Eliminar — solo ADMIN
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!ofertaVentaRepository.existsById(id)) return ResponseEntity.notFound().build();
        ofertaVentaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
