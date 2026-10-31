package com.trabajoverificado.backend.service;

import com.trabajoverificado.backend.dto.AuthResponse;
import com.trabajoverificado.backend.dto.LoginRequest;
import com.trabajoverificado.backend.dto.RegisterRequest;
import com.trabajoverificado.backend.dto.UsuarioResponse;
import com.trabajoverificado.backend.entity.Rol;
import com.trabajoverificado.backend.entity.Usuario;
import com.trabajoverificado.backend.repository.UsuarioRepository;
import com.trabajoverificado.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse registrar(RegisterRequest r) {
        String correo = r.correo().trim().toLowerCase();
        if (usuarioRepo.existsByCorreo(correo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado");
        }
        Usuario u = new Usuario();
        u.setNombre(r.nombre().trim());
        u.setCorreo(correo);
        u.setPassword(encoder.encode(r.password()));
        u.setRol(Rol.TRABAJADOR);
        u.setOficio(r.oficio());
        u.setCiudad(r.ciudad());
        u.setDescripcion(r.descripcion());
        usuarioRepo.save(u);
        return new AuthResponse(jwtService.generar(u), UsuarioResponse.de(u));
    }

    public AuthResponse login(LoginRequest r) {
        Usuario u = usuarioRepo.findByCorreo(r.correo().trim().toLowerCase())
                .filter(x -> encoder.matches(r.password(), x.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos"));
        return new AuthResponse(jwtService.generar(u), UsuarioResponse.de(u));
    }
}