package com.trabajoverificado.backend.controller;

import com.trabajoverificado.backend.dto.AuthResponse;
import com.trabajoverificado.backend.dto.LoginRequest;
import com.trabajoverificado.backend.dto.RegisterRequest;
import com.trabajoverificado.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest r) {
        return authService.registrar(r);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest r) {
        return authService.login(r);
    }
}