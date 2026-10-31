package com.trabajoverificado.backend.repository;

import com.trabajoverificado.backend.entity.Trabajo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrabajoRepository extends JpaRepository<Trabajo, Long> {
    List<Trabajo> findByTrabajadorIdOrderByFechaDesc(Long trabajadorId);
    Optional<Trabajo> findByIdAndTrabajadorId(Long id, Long trabajadorId);
}