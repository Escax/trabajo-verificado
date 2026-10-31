package com.trabajoverificado.backend.dto;

import com.trabajoverificado.backend.config.Avisos;
import com.trabajoverificado.backend.entity.EstadoVerificacion;
import com.trabajoverificado.backend.entity.Trabajo;
import com.trabajoverificado.backend.entity.Verificacion;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record VerificacionPublicaResponse(
        String nombreTrabajador, String oficioTrabajador,
        String nombreCliente, String servicio, LocalDate fecha, BigDecimal valor,
        EstadoVerificacion estado, LocalDateTime fechaExpiracion, String aviso) {

    public static VerificacionPublicaResponse de(Verificacion v) {
        Trabajo t = v.getTrabajo();
        EstadoVerificacion estado =
                (v.getEstado() == EstadoVerificacion.PENDIENTE && v.estaExpirada())
                        ? EstadoVerificacion.EXPIRADA : v.getEstado();
        return new VerificacionPublicaResponse(
                t.getTrabajador().getNombre(), t.getTrabajador().getOficio(),
                t.getNombreCliente(), t.getServicio(), t.getFecha(), t.getValor(),
                estado, v.getFechaExpiracion(), Avisos.NO_CERTIFICA);
    }

}