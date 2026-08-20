package com.webcoches.backend.controller;

import com.webcoches.backend.service.PresupuestoImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/presupuesto")
public class PresupuestoController {

    @Autowired private PresupuestoImportService presupuestoImportService;

    /**
     * El co2 llega tal cual viene del anuncio ("127 g/km (comb.)") porque es
     * el servicio el que sabe interpretarlo. Sin el no se puede calcular el
     * impuesto de matriculacion, y el desglose lo avisa.
     */
    @GetMapping
    public Map<String, Object> calcular(
            @RequestParam double precioBase,
            @RequestParam(required = false) String co2,
            @RequestParam(defaultValue = "false") boolean conItv,
            @RequestParam(defaultValue = "false") boolean conRevision) {
        return presupuestoImportService.calcular(precioBase, co2, conItv, conRevision);
    }
}
