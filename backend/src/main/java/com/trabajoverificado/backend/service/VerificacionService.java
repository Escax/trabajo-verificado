package com.trabajoverificado.backend.service;

import com.trabajoverificado.backend.dto.Decision;
import com.trabajoverificado.backend.dto.RespuestaVerificacionRequest;
import com.trabajoverificado.backend.dto.SolicitudVerificacionResponse;
import com.trabajoverificado.backend.dto.VerificacionPublicaResponse;
import com.trabajoverificado.backend.entity.EstadoTrabajo;
import com.trabajoverificado.backend.entity.EstadoVerificacion;
import com.trabajoverificado.backend.entity.Trabajo;
import com.trabajoverificado.backend.entity.Verificacion;
import com.trabajoverificado.backend.repository.TrabajoRepository;
import com.trabajoverificado.backend.repository.VerificacionRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class VerificacionService {
    private final TrabajoRepository trabajoRepo;
    private final VerificacionRepository verificacionRepo;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Transactional
    public SolicitudVerificacionResponse solicitar(Long userId, Long trabajoId) {
        Trabajo t = trabajoRepo.findByIdAndTrabajadorId(trabajoId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trabajo no encontrado"));

        if (t.getEstado() == EstadoTrabajo.VERIFICADO) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El trabajo ya está verificado");
        }

        var pendiente = verificacionRepo.findFirstByTrabajoIdAndEstado(t.getId(), EstadoVerificacion.PENDIENTE);
        if (pendiente.isPresent()) {
            Verificacion v = pendiente.get();
            if (!v.estaExpirada()) return respuesta(v);   // mismo enlace vigente
            v.setEstado(EstadoVerificacion.EXPIRADA);
        }

        Verificacion nueva = new Verificacion();
        nueva.setTrabajo(t);
        verificacionRepo.save(nueva);
        t.setEstado(EstadoTrabajo.PENDIENTE);   // por si venía de RECHAZADO
        return respuesta(nueva);
    }

    @Transactional(readOnly = true)
    public VerificacionPublicaResponse consultar(UUID token) {
        return VerificacionPublicaResponse.de(buscar(token));
    }

    @Transactional
    public VerificacionPublicaResponse responder(UUID token, RespuestaVerificacionRequest r) {
        Verificacion v = buscar(token);

        if (v.getEstado() != EstadoVerificacion.PENDIENTE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Esta solicitud ya fue respondida");
        }
        if (v.estaExpirada()) {
            throw new ResponseStatusException(HttpStatus.GONE, "El enlace de verificación expiró");
        }

        boolean confirma = r.decision() == Decision.CONFIRMAR;
        v.setEstado(confirma ? EstadoVerificacion.CONFIRMADA : EstadoVerificacion.RECHAZADA);
        v.setComentario(r.comentario() == null ? null : r.comentario().trim());
        v.setFechaRespuesta(LocalDateTime.now());
        v.getTrabajo().setEstado(confirma ? EstadoTrabajo.VERIFICADO : EstadoTrabajo.RECHAZADO);

        return VerificacionPublicaResponse.de(v);
    }

    private Verificacion buscar(UUID token) {
        return verificacionRepo.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enlace de verificación no válido"));
    }

    private SolicitudVerificacionResponse respuesta(Verificacion v) {
        return new SolicitudVerificacionResponse(
                v.getToken(), frontendUrl + "/verificar/" + v.getToken(), v.getFechaExpiracion());
    }
}