package com.webcoches.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "ofertas_venta")
public class OfertaVenta {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Datos del coche ofrecido
    private String marca;
    private String modelo;
    private String version;
    private Integer anio;
    private Integer kilometros;
    private Double precio;
    private String combustible;
    private String transmision;
    private String potencia;
    private String carroceria;
    private String color;
    private Integer puertas;
    private String matricula;
    private String vin;
    private String itv;

    @Column(length = 2000)
    private String descripcion;

    @Column(length = 2000)
    private String fotosJson; // URLs separadas por comas

    // Datos del vendedor
    private String nombreVendedor;
    private String telefonoVendedor;
    private String emailVendedor;
    private String provincia;

    // Gestión interna
    private LocalDateTime fechaSolicitud;

    // PENDIENTE / INTERESADO / DESCARTADA / PUBLICADO
    private String estado;

    @Column(length = 1000)
    private String notasAdmin; // notas internas del admin sobre esta oferta

    @PrePersist
    public void prePersist() {
        this.fechaSolicitud = LocalDateTime.now();
        if (this.estado == null) this.estado = "PENDIENTE";
    }
}
