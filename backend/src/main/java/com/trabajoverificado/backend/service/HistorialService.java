package com.trabajoverificado.backend.service;

import com.trabajoverificado.backend.config.Avisos;
import com.trabajoverificado.backend.dto.EstadisticasResponse;
import com.trabajoverificado.backend.entity.EstadoTrabajo;
import com.trabajoverificado.backend.entity.Trabajo;
import com.trabajoverificado.backend.repository.TrabajoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistorialService {
    private final TrabajoRepository trabajoRepo;

    @Transactional(readOnly = true)
    public EstadisticasResponse estadisticas(Long userId) {
        List<Trabajo> todos = trabajoRepo.findByTrabajadorIdOrderByFechaDesc(userId);
        List<Trabajo> verificados = todos.stream()
                .filter(t -> t.getEstado() == EstadoTrabajo.VERIFICADO)
                .toList();

        return new EstadisticasResponse(
                todos.size(),
                verificados.size(),
                contar(todos, EstadoTrabajo.PENDIENTE),
                contar(todos, EstadoTrabajo.RECHAZADO),
                verificados.stream().map(t -> t.getNombreCliente().trim().toLowerCase()).distinct().count(),
                verificados.stream().map(t -> YearMonth.from(t.getFecha())).distinct().count(),
                verificados.stream().map(Trabajo::getValor).reduce(BigDecimal.ZERO, BigDecimal::add),
                verificados.stream().map(Trabajo::getFecha).min(Comparator.naturalOrder()).orElse(null),
                verificados.stream().map(Trabajo::getFecha).max(Comparator.naturalOrder()).orElse(null),
                Avisos.NO_CERTIFICA);
    }

    private long contar(List<Trabajo> trabajos, EstadoTrabajo estado) {
        return trabajos.stream().filter(t -> t.getEstado() == estado).count();
    }
}