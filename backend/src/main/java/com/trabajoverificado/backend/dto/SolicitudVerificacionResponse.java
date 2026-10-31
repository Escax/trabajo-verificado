package com.trabajoverificado.backend.dto;

import java.util.UUID;

import java.time.LocalDateTime;


public record SolicitudVerificacionResponse(UUID token, String enlace, LocalDateTime fechaExpiracion) {}
