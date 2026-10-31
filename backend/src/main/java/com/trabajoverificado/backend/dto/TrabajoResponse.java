package com.trabajoverificado.backend.dto;

import com.trabajoverificado.backend.entity.EstadoTrabajo;
import com.trabajoverificado.backend.entity.Trabajo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TrabajoResponse(Long id, String nombreCliente, String contactoCliente,
                              String servicio, LocalDate fecha, BigDecimal valor,
                              EstadoTrabajo estado, LocalDateTime fechaRegistro) {
    public static TrabajoResponse de(Trabajo t) {
        return new TrabajoResponse(t.getId(), t.getNombreCliente(), t.getContactoCliente(),
                t.getServicio(), t.getFecha(), t.getValor(), t.getEstado(), t.getFechaRegistro());
    }
}