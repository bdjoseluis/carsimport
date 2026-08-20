package com.webcoches.backend.service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

@Service
public class PresupuestoImportService {

    // Tasas de la DGT mas gestoria. Es lo que cuesta el tramite en si, y no
    // depende del coche.
    private static final double TRANSPORTE     = 450.0;
    private static final double GESTION_MATRIC = 300.0;
    private static final double ITV            = 120.0;
    private static final double REVISION       = 150.0;

    private static final Pattern NUMERO = Pattern.compile("(\\d+([.,]\\d+)?)");

    public Map<String, Object> calcular(double precioBase, String co2,
                                        boolean conItv, boolean conRevision) {

        double comision   = precioBase * getPorcentaje(precioBase);
        double itv        = conItv ? ITV : 0.0;
        double revision   = conRevision ? REVISION : 0.0;

        Double gramos     = extraerCo2(co2);
        Double tipoIedmt  = getTipoIedmt(gramos);
        double iedmt      = tipoIedmt == null ? 0.0 : precioBase * tipoIedmt;

        double total = precioBase + comision + TRANSPORTE + GESTION_MATRIC
                     + iedmt + itv + revision;

        Map<String, Object> desglose = new LinkedHashMap<>();
        desglose.put("precioAlemania", precioBase);
        desglose.put("comisionImportacion", Math.round(comision));
        desglose.put("porcentajeComision", (int)(getPorcentaje(precioBase) * 100) + "%");
        desglose.put("transporte", TRANSPORTE);
        desglose.put("matriculacion", GESTION_MATRIC);

        // IEDMT: el impuesto de matriculacion. Es el gasto mas grande de
        // importar un coche despues del coche, y va por tramos de CO2.
        desglose.put("iedmt", Math.round(iedmt));
        desglose.put("co2", gramos);
        if (tipoIedmt == null) {
            desglose.put("tipoIedmt", "sin determinar");
            desglose.put("avisoIedmt",
                "No consta el CO2 de este vehiculo, asi que el impuesto de "
                + "matriculacion no esta incluido en el total. Segun el tramo "
                + "puede llegar al 14,75% del valor del coche.");
        } else {
            desglose.put("tipoIedmt", formatearTipo(tipoIedmt));
        }

        desglose.put("itv", itv);
        desglose.put("revisionMecanica", revision);
        desglose.put("totalEstimado", Math.round(total));

        // El total sale de una estimacion, no de una liquidacion. Hacienda no
        // calcula el IEDMT sobre lo que has pagado, sino sobre el valor que
        // ella misma asigna al modelo en sus tablas oficiales, con la
        // depreciacion que le corresponda por antiguedad. Aqui se usa el precio
        // de compra como aproximacion, que es lo razonable para orientar al
        // cliente, pero la cifra definitiva sale al presentar el modelo 576.
        desglose.put("aviso",
            "Estimacion orientativa. El impuesto de matriculacion definitivo lo "
            + "fija Hacienda sobre el valor de tablas oficiales del modelo, no "
            + "sobre el precio de compra.");

        return desglose;
    }

    /**
     * Tramos del IEDMT en la peninsula. Devuelve null cuando no sabemos las
     * emisiones: es preferible avisar de que falta el impuesto a colar un cero
     * que el cliente leeria como "no paga".
     */
    private Double getTipoIedmt(Double co2) {
        if (co2 == null)     return null;
        if (co2 < 120)       return 0.0;
        else if (co2 < 160)  return 0.0475;
        else if (co2 < 200)  return 0.0975;
        else                 return 0.1475;
    }

    private String formatearTipo(double tipo) {
        if (tipo == 0.0) return "0% (exento)";
        return String.valueOf(tipo * 100).replace('.', ',') + "%";
    }

    /**
     * El CO2 llega del anuncio como texto ("127 g/km (comb.)"), asi que hay que
     * sacarle el numero.
     */
    private Double extraerCo2(String co2) {
        if (co2 == null || co2.isBlank()) return null;
        Matcher m = NUMERO.matcher(co2);
        if (!m.find()) return null;
        try {
            return Double.parseDouble(m.group(1).replace(',', '.'));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private double getPorcentaje(double precio) {
        if (precio < 5000)        return 0.18;
        else if (precio < 15000)  return 0.15;
        else if (precio < 30000)  return 0.13;
        else                      return 0.12;
    }
}
