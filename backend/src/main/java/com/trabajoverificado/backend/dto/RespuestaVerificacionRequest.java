package com.trabajoverificado.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RespuestaVerificacionRequest(
        @NotNull Decision decision,
        @Size(max = 500) String comentario) {}