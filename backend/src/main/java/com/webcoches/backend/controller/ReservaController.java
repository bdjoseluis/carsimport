package com.webcoches.backend.controller;

import com.webcoches.backend.model.Coche;
import com.webcoches.backend.model.Reserva;
import com.webcoches.backend.repository.CocheRepository;
import com.webcoches.backend.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired private ReservaRepository reservaRepository;
    @Autowired private CocheRepository cocheRepository;

    // Crear reserva — cualquier usuario autenticado
    @PostMapping
    public ResponseEntity<Reserva> crear(@RequestBody Map<String, Object> body) {
        Long cocheId = Long.valueOf(body.get("cocheId").toString());
        Coche coche = cocheRepository.findById(cocheId).orElse(null);
        if (coche == null) return ResponseEntity.notFound().build();

        Reserva reserva = new Reserva();
        reserva.setCoche(coche);
        reserva.setNombre(body.get("nombre").toString());
        reserva.setTelefono(body.get("telefono").toString());
        reserva.setEmail(body.get("email").toString());
        reserva.setComentario(body.getOrDefault("comentario", "").toString());

        return ResponseEntity.ok(reservaRepository.save(reserva));
    }

    // Listar todas — solo ADMIN
    @GetMapping
    public List<Reserva> listar() {
        return reservaRepository.findAll();
    }

    // Reservas de un coche — solo ADMIN
    @GetMapping("/coche/{cocheId}")
    public List<Reserva> porCoche(@PathVariable Long cocheId) {
        return reservaRepository.findByCocheId(cocheId);
    }

    // Cambiar estado — solo ADMIN
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Reserva> cambiarEstado(@PathVariable Long id,
                                                  @RequestBody Map<String, String> body) {
        return reservaRepository.findById(id).map(r -> {
            r.setEstado(body.get("estado"));
            return ResponseEntity.ok(reservaRepository.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Eliminar — solo ADMIN
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!reservaRepository.existsById(id)) return ResponseEntity.notFound().build();
        reservaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
