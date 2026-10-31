package com.trabajoverificado.backend.controller;

import com.trabajoverificado.backend.dto.SolicitudVerificacionResponse;
import com.trabajoverificado.backend.dto.TrabajoRequest;
import com.trabajoverificado.backend.dto.TrabajoResponse;
import com.trabajoverificado.backend.service.TrabajoService;
import com.trabajoverificado.backend.service.VerificacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trabajos")
@RequiredArgsConstructor
public class TrabajoController {
    private final TrabajoService service;
    private final VerificacionService verificacionService;


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TrabajoResponse crear(@AuthenticationPrincipal Long userId, @Valid @RequestBody TrabajoRequest r) {
        return service.crear(userId, r);
    }

    @GetMapping
    public List<TrabajoResponse> listar(@AuthenticationPrincipal Long userId) {
        return service.listar(userId);
    }

    @GetMapping("/{id}")
    public TrabajoResponse obtener(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        return service.obtener(userId, id);
    }

    @PutMapping("/{id}")
    public TrabajoResponse actualizar(@AuthenticationPrincipal Long userId, @PathVariable Long id,
                                      @Valid @RequestBody TrabajoRequest r) {
        return service.actualizar(userId, id, r);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        service.eliminar(userId, id);
    }

    @PostMapping("/{id}/verificacion")
    public SolicitudVerificacionResponse solicitarVerificacion(@AuthenticationPrincipal Long userId,
                                                               @PathVariable Long id) {
        return verificacionService.solicitar(userId, id);
    }
}