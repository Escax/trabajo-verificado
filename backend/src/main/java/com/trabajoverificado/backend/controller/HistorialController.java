package com.trabajoverificado.backend.controller;

import com.trabajoverificado.backend.dto.EstadisticasResponse;
import com.trabajoverificado.backend.service.HistorialService;
import com.trabajoverificado.backend.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/historial")
@RequiredArgsConstructor
public class HistorialController {
    private final HistorialService service;
    private final ReporteService reporteService;

    @GetMapping("/estadisticas")
    public EstadisticasResponse estadisticas(@AuthenticationPrincipal Long userId) {
        return service.estadisticas(userId);
    }

    @GetMapping("/reporte")
    public ResponseEntity<byte[]> reporte(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"historial-trabajos.pdf\"")
                .body(reporteService.generar(userId));
    }
}