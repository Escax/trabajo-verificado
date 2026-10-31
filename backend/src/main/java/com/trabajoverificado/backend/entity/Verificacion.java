package com.trabajoverificado.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "verificaciones")
@Getter
@Setter
@NoArgsConstructor
public class Verificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trabajo_id")
    private Trabajo trabajo;

    @Column(nullable = false, unique = true, updatable = false)
    private UUID token;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoVerificacion estado = EstadoVerificacion.PENDIENTE;

    @Column(length = 500)
    private String comentario;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaSolicitud;

    @Column(nullable = false)
    private LocalDateTime fechaExpiracion;

    private LocalDateTime fechaRespuesta;

    @PrePersist
    void prePersist() {
        if (token == null) token = UUID.randomUUID();
        if (fechaSolicitud == null) fechaSolicitud = LocalDateTime.now();
        if (fechaExpiracion == null) fechaExpiracion = fechaSolicitud.plusDays(7);
    }

    public boolean estaExpirada() {
        return LocalDateTime.now().isAfter(fechaExpiracion);
    }
}