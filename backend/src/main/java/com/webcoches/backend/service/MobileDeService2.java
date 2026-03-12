package com.webcoches.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class MobileDeService2 {

    @Autowired
    private TraduccionService traduccionService;

    private final ObjectMapper mapper = new ObjectMapper();

    public List<Map<String, Object>> obtenerCochesConComision(int maxItems) throws Exception {

        InputStream is = getClass().getResourceAsStream("/data/mobile_de.json");
        if (is == null) throw new RuntimeException("No se encontró el archivo mobile_de.json");

        JsonNode items = mapper.readTree(is);

        List<Map<String, Object>> resultado = new ArrayList<>();
        int count = 0;

        for (JsonNode item : items) {
            if (count++ >= maxItems) break;

            double precioOriginal = item.path("price.total.amount").asDouble(0);
            if (precioOriginal == 0) continue;

            double precioFinal = precioOriginal * (1 + calcularPorcentajeComision(precioOriginal));

            JsonNode attributes   = item.path("attributes");
            JsonNode dealer       = item.path("dealerDetails");
            JsonNode priceRating  = item.path("priceRating");
            JsonNode features     = item.path("features");

            Map<String, Object> coche = new HashMap<>();

            // ── Campos básicos ───────────────────────────────────────────────
            coche.put("apifyId",        item.path("url").asText(UUID.randomUUID().toString()));
            coche.put("titulo",         item.path("title").asText());
            coche.put("marca",          item.path("brand").asText());
            coche.put("modelo",         item.path("model").asText());
            coche.put("precioOriginal", precioOriginal);
            coche.put("precioFinal",    BigDecimal.valueOf(precioFinal).setScale(0, RoundingMode.HALF_UP));
            coche.put("imagenUrl",      item.path("previewImage").asText(""));
            coche.put("urlOriginal",    item.path("url").asText(""));
            coche.put("fuente",         "mobile.de");

            // ── Descripción ──────────────────────────────────────────────────
            String descOriginal = item.path("description").asText(null);
            coche.put("description", traduccionService.traducirDeEs(descOriginal));
            // ── Equipamiento (features) como JSON string ─────────────────────
            // Ej: ["ABS","Bluetooth","Navigation system", ...]
            if (features.isArray() && !features.isEmpty()) {
                coche.put("featuresJson", mapper.writeValueAsString(features));
            }

            // ── Attributes extraídos uno a uno ───────────────────────────────
            coche.put("kilometraje",    attributes.path("Mileage").asText(""));
            coche.put("matriculacion",  attributes.path("First Registration").asText(""));
            coche.put("combustible",    attributes.path("Fuel").asText(""));
            coche.put("cambio",         attributes.path("Transmission").asText(""));
            coche.put("power",          attributes.path("Power").asText(null));
            coche.put("color",          attributes.path("Colour").asText(null));
            coche.put("interiorDesign", attributes.path("Interior Design").asText(null));
            coche.put("numOwners",      attributes.path("Number of Vehicle Owners").asText(null));
            coche.put("hu",             attributes.path("HU").asText(null));
            coche.put("condition",      attributes.path("Vehicle condition").asText(null));
            coche.put("emissionClass",  attributes.path("Emission Class").asText(null));
            coche.put("numSeats",       attributes.path("Number of Seats").asText(null));

            // Consumo: viene como array ["5.7 l/100km (combined)"] → cogemos el primero
            JsonNode fuelNode = attributes.path("Fuel consumption");
            if (fuelNode.isArray() && !fuelNode.isEmpty()) {
                coche.put("fuelConsumption", fuelNode.get(0).asText(null));
            }
            coche.put("co2", attributes.path("CO₂ emissions (comb.)").asText(null));

            // Guardamos todos los attributes como JSON por si acaso
            if (!attributes.isMissingNode()) {
                coche.put("attributesJson", mapper.writeValueAsString(attributes));
            }

            // ── Dealer ───────────────────────────────────────────────────────
            if (!dealer.isMissingNode()) {
                coche.put("dealerName", dealer.path("name").asText(null));

                JsonNode phones = dealer.path("phones");
                if (phones.isArray() && !phones.isEmpty()) {
                    coche.put("dealerPhone", phones.get(0).asText(null));
                }

                JsonNode whatsapp = dealer.path("messengers").path("WHATS_APP");
                if (!whatsapp.isMissingNode()) {
                    coche.put("dealerWhatsapp", whatsapp.asText(null));
                }

                JsonNode score = dealer.path("score").path("total");
                if (!score.isMissingNode()) {
                    coche.put("dealerScore", score.asDouble());
                }
            }

            // ── Price Rating ─────────────────────────────────────────────────
            // Ej: "Fair price", "Good price", "Very good price"
            if (!priceRating.isMissingNode()) {
                coche.put("priceRating", priceRating.path("rating").asText(null));
            }

            resultado.add(coche);
        }

        return resultado;
    }

    private double calcularPorcentajeComision(double precio) {
        if (precio < 5000)       return 0.18;
        else if (precio < 15000) return 0.15;
        else if (precio < 30000) return 0.13;
        else                     return 0.12;
    }
}
