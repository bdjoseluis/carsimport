package com.webcoches.backend.service;

import com.webcoches.backend.model.CocheImportado;
import com.webcoches.backend.repository.CocheImportadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class IngestaCochesService {

    @Autowired private MobileDeService mobileDeService;
    @Autowired private CocheImportadoRepository cocheImportadoRepository;

    @Value("${ingesta.frecuencia:NUNCA}")
    private String frecuencia;

    @Value("${ingesta.max-items:2000}")
    private int maxItems;

    @Scheduled(cron = "0 0 3 * * MON")
    public void ingestaSemanal() {
        if ("SEMANAL".equalsIgnoreCase(frecuencia)) ejecutarIngesta();
    }

    @Scheduled(cron = "0 0 3 1 * *")
    public void ingestaMensual() {
        if ("MENSUAL".equalsIgnoreCase(frecuencia)) ejecutarIngesta();
    }

    public String ejecutarIngesta() {
        try {
            List<Map<String, Object>> coches = mobileDeService.obtenerCochesConComision(maxItems);
            int nuevos = 0;

            for (Map<String, Object> datos : coches) {
                String apifyId = (String) datos.get("apifyId");
                if (apifyId == null) continue;
                if (cocheImportadoRepository.findByApifyId(apifyId).isPresent()) continue;

                CocheImportado c = new CocheImportado();

                // ── Campos básicos ──────────────────────────────────────────
                c.setApifyId(apifyId);
                c.setTitulo((String) datos.get("titulo"));
                c.setMarca((String) datos.get("marca"));
                c.setModelo((String) datos.get("modelo"));
                c.setKilometraje((String) datos.get("kilometraje"));
                c.setCombustible((String) datos.get("combustible"));
                c.setCambio((String) datos.get("cambio"));
                c.setMatriculacion((String) datos.get("matriculacion"));
                c.setImagenUrl((String) datos.get("imagenUrl"));
                c.setUrlOriginal((String) datos.get("urlOriginal"));
                c.setPrecioOriginal(toBigDecimal(datos.get("precioOriginal")));
                c.setPrecioConComision(toBigDecimal(datos.get("precioFinal")));
                c.setFechaIngesta(LocalDateTime.now());
                c.setActivo(true);

                // ── Descripción y equipamiento ──────────────────────────────
                c.setDescription(getString(datos, "description"));
                c.setFeaturesJson(getString(datos, "featuresJson"));
                c.setAttributesJson(getString(datos, "attributesJson"));

                // ── Atributos técnicos extraídos ────────────────────────────
                c.setPower(getString(datos, "power"));
                c.setFuelConsumption(getString(datos, "fuelConsumption"));
                c.setCo2(getString(datos, "co2"));
                c.setColor(getString(datos, "color"));
                c.setInteriorDesign(getString(datos, "interiorDesign"));
                c.setNumOwners(getString(datos, "numOwners"));
                c.setHu(getString(datos, "hu"));
                c.setCondition(getString(datos, "condition"));
                c.setEmissionClass(getString(datos, "emissionClass"));
                c.setNumSeats(getString(datos, "numSeats"));
                c.setPriceRating(getString(datos, "priceRating"));

                // ── Datos del concesionario ─────────────────────────────────
                c.setDealerName(getString(datos, "dealerName"));
                c.setDealerPhone(getString(datos, "dealerPhone"));
                c.setDealerWhatsapp(getString(datos, "dealerWhatsapp"));
                if (datos.get("dealerScore") != null) {
                    c.setDealerScore(toDouble(datos.get("dealerScore")));
                }

                cocheImportadoRepository.save(c);
                nuevos++;
            }

            return "Ingesta completada: " + nuevos + " coches nuevos guardados.";

        } catch (Exception e) {
            return "Error en ingesta: " + e.getMessage();
        }
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private String getString(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val != null ? val.toString() : null;
    }

    private BigDecimal toBigDecimal(Object val) {
        if (val == null) return BigDecimal.ZERO;
        if (val instanceof BigDecimal bd) return bd;
        if (val instanceof Double d) return BigDecimal.valueOf(d);
        if (val instanceof Integer i) return BigDecimal.valueOf(i);
        if (val instanceof Long l) return BigDecimal.valueOf(l);
        try { return new BigDecimal(val.toString()); }
        catch (Exception e) { return BigDecimal.ZERO; }
    }

    private Double toDouble(Object val) {
        if (val instanceof Double d) return d;
        if (val instanceof Number n) return n.doubleValue();
        try { return Double.parseDouble(val.toString()); }
        catch (Exception e) { return null; }
    }
}
