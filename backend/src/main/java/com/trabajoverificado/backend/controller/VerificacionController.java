package com.trabajoverificado.backend.controller;

import com.trabajoverificado.backend.dto.RespuestaVerificacionRequest;
import com.trabajoverificado.backend.dto.VerificacionPublicaResponse;
import com.trabajoverificado.backend.service.VerificacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.UUID;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verificaciones")
@RequiredArgsConstructor
public class VerificacionController {
    private final VerificacionService service;

    @GetMapping("/{token}")
    public VerificacionPublicaResponse consultar(@PathVariable UUID token) {
        return service.consultar(token);
    }

    @PostMapping("/{token}")
    public VerificacionPublicaResponse responder(@PathVariable UUID token,
                                                 @Valid @RequestBody RespuestaVerificacionRequest r) {
        return service.responder(token, r);
    }
}