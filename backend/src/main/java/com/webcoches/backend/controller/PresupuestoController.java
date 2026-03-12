package com.webcoches.backend.controller;

import com.webcoches.backend.service.PresupuestoImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/presupuesto")
public class PresupuestoController {

    @Autowired private PresupuestoImportService presupuestoImportService;

    @GetMapping
    public Map<String, Object> calcular(
            @RequestParam double precioBase,
            @RequestParam(defaultValue = "false") boolean conItv,
            @RequestParam(defaultValue = "false") boolean conRevision) {
        return presupuestoImportService.calcular(precioBase, conItv, conRevision);
    }
}
