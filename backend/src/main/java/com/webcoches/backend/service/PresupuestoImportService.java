package com.webcoches.backend.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class PresupuestoImportService {

    public Map<String, Object> calcular(double precioBase, boolean conItv, boolean conRevision) {
        double comision = precioBase * getPorcentaje(precioBase);
        double transporte = 450.0;
        double matriculacion = 300.0;
        double itv = conItv ? 120.0 : 0.0;
        double revision = conRevision ? 150.0 : 0.0;
        double total = precioBase + comision + transporte + matriculacion + itv + revision;

        Map<String, Object> desglose = new LinkedHashMap<>();
        desglose.put("precioAlemania", precioBase);
        desglose.put("comisionImportacion", Math.round(comision));
        desglose.put("porcentajeComision", (int)(getPorcentaje(precioBase) * 100) + "%");
        desglose.put("transporte", transporte);
        desglose.put("matriculacion", matriculacion);
        desglose.put("itv", itv);
        desglose.put("revisionMecanica", revision);
        desglose.put("totalEstimado", Math.round(total));
        return desglose;
    }

    private double getPorcentaje(double precio) {
        if (precio < 5000)        return 0.18;
        else if (precio < 15000)  return 0.15;
        else if (precio < 30000)  return 0.13;
        else                      return 0.12;
    }
}
