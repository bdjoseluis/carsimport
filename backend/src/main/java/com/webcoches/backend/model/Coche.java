package com.webcoches.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@NoArgsConstructor
@Entity
@Table(name = "coches")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Coche {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Publicación
    private String fechaPublicacion;
    private Double precio;          // ← era BigDecimal

    @Column(length = 2000)
    private String descripcion;

    // Detalles del coche
    private String marca;
    private String modelo;
    private String version;
    private Integer kilometros;
    private Integer anio;
    private String matriculacion;
    private String combustible;
    private Integer potenciaCV;
    private Integer cilindrada;
    private String transmision;
    private String tipoCarroceria;
    private Integer numPuertas;
    private String colorExterior;
    private String colorInterior;
    private String estado;
    private Boolean esNacional;
    private Boolean revisionesAlDia;
    private Boolean garantia;

    @Column(length = 2000)
    private String imagenUrl;
}
