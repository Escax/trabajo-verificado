package com.trabajoverificado.backend.dto;

import com.trabajoverificado.backend.entity.EstadoTrabajo;
import com.trabajoverificado.backend.entity.Trabajo;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TrabajoRequest(
        @NotBlank @Size(max = 100) String nombreCliente,
        @Size(max = 100) String contactoCliente,
        @NotBlank @Size(max = 150) String servicio,
        @NotNull @PastOrPresent LocalDate fecha,
        @NotNull @Positive @Digits(integer = 10, fraction = 2) BigDecimal valor) {}


