package com.trabajoverificado.backend.service;

import com.trabajoverificado.backend.dto.TrabajoRequest;
import com.trabajoverificado.backend.dto.TrabajoResponse;
import com.trabajoverificado.backend.entity.EstadoTrabajo;
import com.trabajoverificado.backend.entity.EstadoVerificacion;
import com.trabajoverificado.backend.entity.Trabajo;
import com.trabajoverificado.backend.repository.TrabajoRepository;
import com.trabajoverificado.backend.repository.UsuarioRepository;
import com.trabajoverificado.backend.repository.VerificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrabajoService {
    private final TrabajoRepository trabajoRepo;
    private final UsuarioRepository usuarioRepo;
    private final VerificacionRepository verificacionRepo;

    @Transactional
    public TrabajoResponse crear(Long userId, TrabajoRequest r) {
        Trabajo t = new Trabajo();
        t.setTrabajador(usuarioRepo.getReferenceById(userId));
        aplicar(t, r);
        return TrabajoResponse.de(trabajoRepo.save(t));
    }

    @Transactional(readOnly = true)
    public List<TrabajoResponse> listar(Long userId) {
        return trabajoRepo.findByTrabajadorIdOrderByFechaDesc(userId)
                .stream().map(TrabajoResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public TrabajoResponse obtener(Long userId, Long id) {
        return TrabajoResponse.de(buscarPropio(userId, id));
    }

    @Transactional
    public TrabajoResponse actualizar(Long userId, Long id, TrabajoRequest r) {
        Trabajo t = buscarPropio(userId, id);
        validarModificable(t);
        aplicar(t, r);
        t.setEstado(EstadoTrabajo.PENDIENTE);  // si estaba RECHAZADO, vuelve a pendiente
        return TrabajoResponse.de(t);
    }

    @Transactional
    public void eliminar(Long userId, Long id) {
        Trabajo t = buscarPropio(userId, id);
        validarModificable(t);
        verificacionRepo.deleteByTrabajoId(t.getId());
        trabajoRepo.delete(t);
    }

    // --- auxiliares ---

    private Trabajo buscarPropio(Long userId, Long id) {
        return trabajoRepo.findByIdAndTrabajadorId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trabajo no encontrado"));
    }

    private void validarModificable(Trabajo t) {
        if (t.getEstado() == EstadoTrabajo.VERIFICADO) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Un trabajo verificado no se puede modificar");
        }
        verificacionRepo.findFirstByTrabajoIdAndEstado(t.getId(), EstadoVerificacion.PENDIENTE)
                .ifPresent(v -> {
                    if (!v.estaExpirada()) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "El trabajo tiene una verificación pendiente");
                    }
                    v.setEstado(EstadoVerificacion.EXPIRADA);
                });
    }

    private void aplicar(Trabajo t, TrabajoRequest r) {
        t.setNombreCliente(r.nombreCliente().trim());
        t.setContactoCliente(r.contactoCliente() == null ? null : r.contactoCliente().trim());
        t.setServicio(r.servicio().trim());
        t.setFecha(r.fecha());
        t.setValor(r.valor());
    }
}
