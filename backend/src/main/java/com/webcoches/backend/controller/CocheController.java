package com.webcoches.backend.controller;

import com.webcoches.backend.exception.RecursoNoEncontradoException;
import com.webcoches.backend.model.Coche;
import com.webcoches.backend.repository.CocheRepository;
import com.webcoches.backend.specification.CocheSpec;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coches")
public class CocheController {

    private final CocheRepository cocheRepository;

    public CocheController(CocheRepository cocheRepository) {
        this.cocheRepository = cocheRepository;
    }

    @GetMapping
    public List<Coche> listar() {
        return cocheRepository.findAll();
    }

    /**
     * Busqueda con filtros. Este endpoint faltaba: el front ya lo llamaba
     * (/api/coches/buscar) y devolvia 404, asi que el buscador del catalogo
     * nunca llego a funcionar.
     */
    @GetMapping("/buscar")
    public List<Coche> buscar(
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String modelo,
            @RequestParam(required = false) Double precioMin,
            @RequestParam(required = false) Double precioMax,
            @RequestParam(required = false) Integer anioMin,
            @RequestParam(required = false) Integer anioMax,
            @RequestParam(required = false) String combustible,
            @RequestParam(required = false) String transmision,
            @RequestParam(required = false) String tipoCarroceria,
            @RequestParam(required = false) String estado) {

        Specification<Coche> spec = Specification
            .where(CocheSpec.marcaContiene(marca))
            .and(CocheSpec.modeloContiene(modelo))
            .and(CocheSpec.precioMinimo(precioMin))
            .and(CocheSpec.precioMaximo(precioMax))
            .and(CocheSpec.anioMinimo(anioMin))
            .and(CocheSpec.anioMaximo(anioMax))
            .and(CocheSpec.combustible(combustible))
            .and(CocheSpec.transmision(transmision))
            .and(CocheSpec.tipoCarroceria(tipoCarroceria))
            .and(CocheSpec.estado(estado));

        return cocheRepository.findAll(spec);
    }

    @GetMapping("/{id}")
    public Coche detalle(@PathVariable Long id) {
        return cocheRepository.findById(id)
            .orElseThrow(() -> RecursoNoEncontradoException.de("Coche", id));
    }

    @PostMapping
    public ResponseEntity<Coche> crear(@RequestBody Coche coche) {
        coche.setId(null); // el id lo genera la base de datos, nunca el cliente
        return ResponseEntity.ok(cocheRepository.save(coche));
    }

    @PutMapping("/{id}")
    public Coche actualizar(@PathVariable Long id, @RequestBody Coche datos) {
        Coche coche = cocheRepository.findById(id)
            .orElseThrow(() -> RecursoNoEncontradoException.de("Coche", id));

        datos.setId(coche.getId());
        return cocheRepository.save(datos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!cocheRepository.existsById(id)) {
            throw RecursoNoEncontradoException.de("Coche", id);
        }
        cocheRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
