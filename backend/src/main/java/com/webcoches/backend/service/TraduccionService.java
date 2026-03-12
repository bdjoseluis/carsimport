package com.webcoches.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class TraduccionService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public String traducirDeEs(String texto) {
        if (texto == null || texto.isBlank()) return texto;
        try {
            String textoCorto = texto.length() > 450 
                ? texto.substring(0, 450) + "..." 
                : texto;

            String url = "https://api.mymemory.translated.net/get?q="
                    + java.net.URLEncoder.encode(textoCorto, "UTF-8")
                    + "&langpair=de|es";

            String response = restTemplate.getForObject(url, String.class);
            JsonNode json = mapper.readTree(response);
            return json.path("responseData").path("translatedText").asText(texto);

        } catch (Exception e) {
            return texto; // si falla, devuelve el original
        }
    }
}
