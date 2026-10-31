package com.trabajoverificado.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EstadisticasResponse(
        long trabajosRegistrados,
        long trabajosVerificados,
        long trabajosPendientes,
        long trabajosRechazados,
        long clientesDistintos,
        long mesesActividad,
        BigDecimal montoTotalVerificado,
        LocalDate primerTrabajoVerificado,
        LocalDate ultimoTrabajoVerificado,
        String aviso) {}
