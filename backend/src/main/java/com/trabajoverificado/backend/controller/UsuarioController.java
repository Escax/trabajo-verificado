package com.trabajoverificado.backend.controller;

import com.trabajoverificado.backend.dto.UsuarioResponse;
import com.trabajoverificado.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioRepository usuarioRepo;

    @GetMapping("/me")
    public UsuarioResponse me(@AuthenticationPrincipal Long userId) {
        return usuarioRepo.findById(userId)
                .map(UsuarioResponse::de)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }
}