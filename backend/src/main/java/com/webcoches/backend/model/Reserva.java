package com.webcoches.backend.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;


@Data
@NoArgsConstructor
@Entity
@Table(name = "reservas")
public class Reserva {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String telefono;
    private String email;

    @Column(length = 1000)
    private String comentario;

    private LocalDateTime fechaSolicitud;
    private String estado; // PENDIENTE, ATENDIDA, CANCELADA

    @ManyToOne
    @JoinColumn(name = "coche_id")
    private Coche coche;

    @PrePersist
    public void prePersist() {
        this.fechaSolicitud = LocalDateTime.now();
        if (this.estado == null) this.estado = "PENDIENTE";
    }
}
