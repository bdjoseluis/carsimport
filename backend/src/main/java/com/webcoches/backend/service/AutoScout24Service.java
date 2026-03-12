package com.webcoches.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class AutoScout24Service {

    @Value("${apify.api-token}")
    private String apiToken;

    @Value("${apify.autoscout-dataset-id}")
    private String datasetId;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public List<Map<String, Object>> obtenerCochesConComision(int maxItems) throws Exception {

        String url = "https://api.apify.com/v2/datasets/" + datasetId
                     + "/items?token=" + apiToken + "&limit=" + maxItems;

        String raw = restTemplate.getForObject(url, String.class);

        if (raw == null || raw.isBlank()) {
            throw new RuntimeException("Respuesta vacía de Apify");
        }

        JsonNode items = mapper.readTree(raw);

        if (!items.isArray()) {
            throw new RuntimeException("Se esperaba array. Recibido: " + raw.substring(0, Math.min(200, raw.length())));
        }

        List<Map<String, Object>> resultado = new ArrayList<>();
        int count = 0;

        for (JsonNode item : items) {
            if (count++ >= maxItems) break;

            // ── Precio: parsear "€ 27,440" → 27440.0 ───────────────────────
            double precioOriginal = parsearPrecio(item.path("price").asText(""));
            if (precioOriginal == 0) continue;

            double precioFinal = precioOriginal * (1 + calcularPorcentajeComision(precioOriginal));

            Map<String, Object> coche = new HashMap<>();

            coche.put("apifyId",        item.path("url").asText(UUID.randomUUID().toString()));
            coche.put("titulo",         item.path("title").asText());
            coche.put("marca",          item.path("mark").asText());
            coche.put("modelo",         item.path("model").asText());
            coche.put("precioOriginal", precioOriginal);
            coche.put("precioFinal",    BigDecimal.valueOf(precioFinal).setScale(0, RoundingMode.HALF_UP));
            coche.put("kilometraje",    item.path("milage").asText(""));
            coche.put("combustible",    item.path("fuelType").asText(""));
            coche.put("dealerName",     item.path("contactName").asText(null));
            coche.put("urlOriginal",    item.path("url").asText(""));
            coche.put("imagenUrl",      "");
            coche.put("fuente",         "autoscout24");

            resultado.add(coche);
        }

        return resultado;
    }

    private double parsearPrecio(String precioStr) {
        try {
            // "€ 27,440" → "27440"
            return Double.parseDouble(
                precioStr.replace("€", "")
                         .replace(".", "")
                         .replace(",", "")
                         .trim()
            );
        } catch (Exception e) {
            return 0;
        }
    }

    private double calcularPorcentajeComision(double precio) {
        if (precio < 5000)       return 0.18;
        else if (precio < 15000) return 0.15;
        else if (precio < 30000) return 0.13;
        else                     return 0.12;
    }
}
