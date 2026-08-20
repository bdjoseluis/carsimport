package com.webcoches.backend.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * La calculadora cobraba 300 EUR fijos de matriculacion e ignoraba el IEDMT,
 * que es el gasto mas grande de importar un coche despues del coche. En el
 * Porsche del catalogo (223 g/km) se dejaba fuera casi 7.000 EUR.
 *
 * Son cuentas de dinero que el cliente ve, asi que van cubiertas tramo a tramo
 * y, sobre todo, en el caso de que no conste el CO2.
 */
@DisplayName("Presupuesto de importacion (IEDMT)")
class PresupuestoImportServiceTest {

    private final PresupuestoImportService servicio = new PresupuestoImportService();

    @Test
    @DisplayName("por debajo de 120 g/km el impuesto es cero, pero consta como exento")
    void tramoExento() {
        Map<String, Object> d = servicio.calcular(20000, "119 g/km (comb.)", false, false);

        assertEquals(0L, d.get("iedmt"));
        assertEquals("0% (exento)", d.get("tipoIedmt"));
        assertNull(d.get("avisoIedmt"), "con el CO2 conocido no debe avisar de nada");
    }

    @Test
    @DisplayName("de 120 a 159 g/km aplica el 4,75%")
    void tramoBajo() {
        Map<String, Object> d = servicio.calcular(20000, "127 g/km (comb.)", false, false);

        assertEquals(950L, d.get("iedmt"));
        assertEquals("4,75%", d.get("tipoIedmt"));
    }

    @Test
    @DisplayName("de 160 a 199 g/km aplica el 9,75%")
    void tramoMedio() {
        Map<String, Object> d = servicio.calcular(20000, "160 g/km", false, false);

        assertEquals(1950L, d.get("iedmt"));
        assertEquals("9,75%", d.get("tipoIedmt"));
    }

    @Test
    @DisplayName("el Porsche del catalogo se va al tramo alto: casi 7.000 EUR")
    void tramoAlto() {
        Map<String, Object> d = servicio.calcular(46900, "223 g/km (comb.)", false, false);

        assertEquals(6918L, d.get("iedmt"));
        assertEquals("14,75%", d.get("tipoIedmt"));
    }

    @Test
    @DisplayName("los limites de tramo caen en el tramo de arriba")
    void fronterasDeTramo() {
        assertEquals("0% (exento)", servicio.calcular(20000, "119", false, false).get("tipoIedmt"));
        assertEquals("4,75%",  servicio.calcular(20000, "120", false, false).get("tipoIedmt"));
        assertEquals("9,75%",  servicio.calcular(20000, "160", false, false).get("tipoIedmt"));
        assertEquals("14,75%", servicio.calcular(20000, "200", false, false).get("tipoIedmt"));
    }

    @Test
    @DisplayName("sin CO2 no cobra cero: avisa de que falta el impuesto")
    void sinCo2Avisa() {
        Map<String, Object> d = servicio.calcular(20000, null, false, false);

        assertEquals("sin determinar", d.get("tipoIedmt"));
        assertNotNull(d.get("avisoIedmt"), "un cero el cliente lo lee como 'no paga'");
        assertNull(d.get("co2"));
        // El total no puede incluir un impuesto que no sabemos calcular.
        assertEquals(20000 + 2600 + 450 + 300, ((Number) d.get("totalEstimado")).longValue());
    }

    @Test
    @DisplayName("un CO2 ilegible se trata como si no constara")
    void co2Ilegible() {
        Map<String, Object> d = servicio.calcular(20000, "no disponible", false, false);

        assertEquals("sin determinar", d.get("tipoIedmt"));
        assertNotNull(d.get("avisoIedmt"));
    }

    @Test
    @DisplayName("acepta el CO2 con coma decimal")
    void co2ConComa() {
        Map<String, Object> d = servicio.calcular(20000, "159,9 g/km (comb.)", false, false);

        assertEquals("4,75%", d.get("tipoIedmt"));
        assertEquals(159.9, (Double) d.get("co2"), 0.001);
    }

    @Test
    @DisplayName("el impuesto entra en el total junto al resto de gastos")
    void elImpuestoSumaAlTotal() {
        Map<String, Object> d = servicio.calcular(20000, "223 g/km", true, true);

        long esperado = 20000          // coche
                      + 2600           // comision del 13%
                      + 450            // transporte
                      + 300            // gestion de matriculacion
                      + 2950           // IEDMT 14,75%
                      + 120            // ITV
                      + 150;           // revision
        assertEquals(esperado, ((Number) d.get("totalEstimado")).longValue());
    }

    @Test
    @DisplayName("siempre avisa de que es una estimacion, no una liquidacion")
    void avisoGeneralSiempre() {
        assertNotNull(servicio.calcular(20000, "127 g/km", false, false).get("aviso"));
        assertNotNull(servicio.calcular(20000, null, false, false).get("aviso"));
    }
}
