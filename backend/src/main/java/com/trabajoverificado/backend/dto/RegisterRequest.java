package com.trabajoverificado.backend.dto;

import com.trabajoverificado.backend.entity.Usuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 100) String nombre,
        @NotBlank @Email String correo,
        @NotBlank @Size(min = 8, max = 72) String password,
        String oficio, String ciudad,
        @Size(max = 500) String descripcion) {}

