package com.trabajoverificado.backend.dto;

import com.trabajoverificado.backend.entity.Usuario;

public record UsuarioResponse(Long id, String nombre, String correo,
                              String oficio, String ciudad, String descripcion) {
    public static UsuarioResponse de(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNombre(), u.getCorreo(),
                u.getOficio(), u.getCiudad(), u.getDescripcion());
    }
}
