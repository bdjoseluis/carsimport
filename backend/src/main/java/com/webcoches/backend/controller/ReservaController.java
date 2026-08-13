package com.webcoches.backend.controller;

import com.webcoches.backend.dto.ReservaRequest;
import com.webcoches.backend.exception.RecursoNoEncontradoException;
import com.webcoches.backend.model.Coche;
import com.webcoches.backend.model.Reserva;
import com.webcoches.backend.repository.CocheRepository;
import com.webcoches.backend.repository.ReservaRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Reservas de vehiculos.
 *
 * OJO: las reservas contienen datos personales (nombre, telefono, email). Todo
 * lo que sea consultarlas o gestionarlas exige rol ADMIN; las reglas viven en
 * SecurityConfig. Crear una reserva si es publico, porque es el formulario de
 * contacto que rellena el visitante.
 */
@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaRepository reservaRepository;
    private final CocheRepository cocheRepository;

    public ReservaController(ReservaRepository reservaRepository,
                             CocheRepository cocheRepository) {
        this.reservaRepository = reservaRepository;
        this.cocheRepository = cocheRepository;
    }

    /** Publico. */
    @PostMapping
    public ResponseEntity<Map<String, Object>> crear(@Valid @RequestBody ReservaRequest request) {

        Coche coche = cocheRepository.findById(request.cocheId())
            .orElseThrow(() -> RecursoNoEncontradoException.de("Coche", request.cocheId()));

        Reserva reserva = new Reserva();
        reserva.setCoche(coche);
        reserva.setNombre(request.nombre());
        reserva.setTelefono(request.telefono());
        reserva.setEmail(request.email());
        reserva.setComentario(request.comentario() != null ? request.comentario() : "");

        Reserva guardada = reservaRepository.save(reserva);

        // No devolvemos la reserva entera para no reflejar datos personales
        // en la respuesta de un endpoint publico.
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", guardada.getId(),
                "estado", guardada.getEstado(),
                "mensaje", "Reserva registrada. Te contactaremos en breve."));
    }

    /** Solo ADMIN. */
    @GetMapping
    public List<Reserva> listar() {
        return reservaRepository.findAll();
    }

    /** Solo ADMIN. */
    @GetMapping("/coche/{cocheId}")
    public List<Reserva> porCoche(@PathVariable Long cocheId) {
        return reservaRepository.findByCocheId(cocheId);
    }

    /** Solo ADMIN. */
    @PatchMapping("/{id}/estado")
    public Reserva cambiarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String estado = body.get("estado");
        if (estado == null || estado.isBlank()) {
            throw new IllegalArgumentException("El campo 'estado' es obligatorio");
        }

        Reserva reserva = reservaRepository.findById(id)
            .orElseThrow(() -> RecursoNoEncontradoException.de("Reserva", id));

        reserva.setEstado(estado);
        return reservaRepository.save(reserva);
    }

    /** Solo ADMIN. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!reservaRepository.existsById(id)) {
            throw RecursoNoEncontradoException.de("Reserva", id);
        }
        reservaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
