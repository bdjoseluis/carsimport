package com.webcoches.backend;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;

/**
 * El seed traia un hash de BCrypt copiado de algun sitio que NO correspondia a
 * la contrasena documentada. Resultado: las dos cuentas de demo existian en la
 * base de datos pero no se podia entrar con ninguna, ni en local ni en el VPS,
 * asi que la mitad de la aplicacion (reservas, panel de administracion) no se
 * podia ensenar a nadie.
 *
 * Los tests corren sobre H2 con spring.sql.init.mode=never, o sea que data.sql
 * no se ejecuta y ningun test lo miraba. Este lo lee como recurso y comprueba
 * el hash directamente, que es lo unico que hacia falta para haberlo pillado.
 */
@DisplayName("Cuentas de demo del seed")
class CuentasDeDemoTest {

    /** La que aparece en el README y en el comentario de data.sql. */
    private static final String CONTRASENA_DOCUMENTADA = "password";

    private static final Pattern HASH = Pattern.compile("'(\\$2[aby]\\$\\d{2}\\$[./A-Za-z0-9]{53})'");

    @Test
    @DisplayName("se puede entrar con la contrasena que dice la documentacion")
    void losHashesDelSeedCasanConLaContrasenaDocumentada() throws Exception {
        String sql = new String(new ClassPathResource("data.sql").getInputStream().readAllBytes(),
                                StandardCharsets.UTF_8);

        List<String> hashes = new ArrayList<>();
        Matcher m = HASH.matcher(sql);
        while (m.find()) {
            hashes.add(m.group(1));
        }

        assertFalse(hashes.isEmpty(), "data.sql deberia sembrar alguna cuenta con su hash");

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        for (String hash : hashes) {
            assertTrue(encoder.matches(CONTRASENA_DOCUMENTADA, hash),
                "El hash " + hash + " del seed no corresponde a \"" + CONTRASENA_DOCUMENTADA
                + "\": la cuenta de demo quedaria inaccesible");
        }
    }
}
