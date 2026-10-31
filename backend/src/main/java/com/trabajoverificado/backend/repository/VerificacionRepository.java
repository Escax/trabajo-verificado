package com.trabajoverificado.backend.repository;

import com.trabajoverificado.backend.entity.EstadoVerificacion;
import com.trabajoverificado.backend.entity.Verificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface VerificacionRepository extends JpaRepository<Verificacion, Long> {
    Optional<Verificacion> findByToken(UUID token);
    boolean existsByTrabajoIdAndEstado(Long trabajoId, EstadoVerificacion estado);
}
