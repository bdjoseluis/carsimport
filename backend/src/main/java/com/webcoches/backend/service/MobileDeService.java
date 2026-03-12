package com.webcoches.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class MobileDeService {

    @Autowired
    private TraduccionService traduccionService;

    @Value("${apify.api-token}")
    private String apiToken;

    @Value("${apify.dataset-id}")
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
            throw new RuntimeException("Se esperaba array de Apify. Recibido: " + raw.substring(0, Math.min(200, raw.length())));
        }

        List<Map<String, Object>> resultado = new ArrayList<>();
        int count = 0;

        for (JsonNode item : items) {
            if (count++ >= maxItems) break;

            // ── FIX: precio es objeto anidado price -> total -> amount ────────
            double precioOriginal = item.path("price").path("total").path("amount").asDouble(0);

            if (precioOriginal == 0) continue;

            double precioFinal = precioOriginal * (1 + calcularPorcentajeComision(precioOriginal));

            JsonNode attributes  = item.path("attributes");
            JsonNode dealer      = item.path("dealerDetails");
            JsonNode priceRating = item.path("priceRating");
            JsonNode features    = item.path("features");

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

            // ── Features como JSON string ────────────────────────────────────
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

            // Consumo: puede ser string directo o array
            JsonNode fuelNode = attributes.path("Fuel consumption");
            if (fuelNode.isArray() && !fuelNode.isEmpty()) {
                coche.put("fuelConsumption", fuelNode.get(0).asText(null));
            } else if (fuelNode.isTextual()) {
                coche.put("fuelConsumption", fuelNode.asText(null));
            }

            coche.put("co2", attributes.path("CO₂ emissions (comb.)").asText(null));

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

                JsonNode whatsapp = dealer.path("messengers").path("WHATSAPP");
                if (!whatsapp.isMissingNode()) {
                    coche.put("dealerWhatsapp", whatsapp.asText(null));
                }

                JsonNode score = dealer.path("score").path("total");
                if (!score.isMissingNode()) {
                    coche.put("dealerScore", score.asDouble());
                }
            }

            // ── Price Rating ─────────────────────────────────────────────────
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
