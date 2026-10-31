package com.trabajoverificado.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String nombre;
    @Column(nullable = false, unique = true) private String correo;
    @Column(nullable = false) private String password;   // hash BCrypt

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    private String oficio;
    private String ciudad;
    @Column(length = 500) private String descripcion;
}