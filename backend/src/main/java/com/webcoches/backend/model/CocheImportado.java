package com.webcoches.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "coches_importados")
public class CocheImportado {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String apifyId;
    private String fuente; // "mobile.de" o "autoscout24"
    private String titulo;
    private String marca;
    private String modelo;
    private String kilometraje;
    private String combustible;
    private String cambio;
    private String matriculacion;

    private BigDecimal precioOriginal;
    private BigDecimal precioConComision;

    @Column(length = 1000)
    private String imagenUrl;

    @Column(length = 500)
    private String urlOriginal;

    private LocalDateTime fechaIngesta;
    private LocalDateTime fechaUltimaVista;
    private Boolean activo = true;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String featuresJson;

    @Column(columnDefinition = "TEXT")
    private String attributesJson;

    // Dealer
    private String dealerName;
    private String dealerPhone;
    private String dealerWhatsapp;
    private Double dealerScore;

    // Atributos clave
    private String power;
    private String fuelConsumption;
    private String co2;
    private String color;
    private String interiorDesign;
    private String numOwners;
    private String hu;

    @Column(name = "vehicle_condition")
    private String condition;

    @Column(name = "emission_class_val")
    private String emissionClass;

    private String numSeats;
    private String priceRating;
}
