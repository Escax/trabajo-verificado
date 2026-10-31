# TrabajoVerificado

Plataforma web para que trabajadores independientes (aseo, domicilios, tutorías, oficios varios) construyan un **historial digital verificable** de sus trabajos. Cada trabajo registrado puede ser confirmado por el cliente mediante un enlace único, sin necesidad de que el cliente cree una cuenta.

> **Aviso:** TrabajoVerificado no certifica oficialmente ingresos ni experiencia laboral. La información es registrada por el trabajador y confirmada por sus clientes.

Proyecto académico —  Proyecto de Software, Actividad 4.
Autor: [Esneider Cardozo — Ingeniería de Software, 6.º semestre.]

---

## Funcionalidades

1. Registro e inicio de sesión de trabajadores (JWT).
2. Registro, edición y eliminación de trabajos (cliente, servicio, fecha, valor).
3. Solicitud de verificación: el sistema genera un enlace con token único (UUID) válido por 7 días.
4. Página pública donde el cliente confirma o rechaza el trabajo, sin crear cuenta.
5. Historial con estadísticas: trabajos registrados y verificados, clientes distintos, meses de actividad y monto total verificado.
6. Descarga de un reporte en PDF con los trabajos verificados.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Backend | Java 21, Spring Boot 4, Spring Security + JWT (jjwt), Spring Data JPA / Hibernate |
| Base de datos | PostgreSQL 16 (Docker) |
| PDF | OpenPDF |
| Frontend | React + Vite, React Router, Axios |

## Estructura del repositorio

```
trabajo-verificado/
├── backend/             # API REST con Spring Boot
├── frontend/            # Aplicación React + Vite
├── docker-compose.yml   # Base de datos PostgreSQL
└── README.md
```

---

## Instalación y ejecución

### Requisitos

- Java 21
- Node.js 20 o superior
- Docker Desktop
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/Escax/trabajo-verificado.git
cd trabajo-verificado
```

### 2. Levantar la base de datos

```bash
docker compose up -d
```

PostgreSQL queda disponible en `localhost:5440` (se usa el puerto 5440 para no chocar con instalaciones locales de PostgreSQL en el 5432). Las tablas se crean automáticamente al iniciar el backend.

### 3. Configurar el secreto del JWT

El backend lee el secreto desde la variable de entorno `JWT_SECRET` (debe ser un valor Base64 de al menos 32 bytes). Para generarlo:

```bash
openssl rand -base64 32
```

### 4. Ejecutar el backend

**Windows (PowerShell):**
```powershell
cd backend
$env:JWT_SECRET="valor_generado"
.\mvnw spring-boot:run
```

**Linux / macOS / Git Bash:**
```bash
cd backend
export JWT_SECRET="valor_generado"
./mvnw spring-boot:run
```

La API queda en `http://localhost:8080`.

### 5. Ejecutar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`.

Opcionalmente se puede copiar `frontend/.env.example` a `frontend/.env` para cambiar la URL de la API (por defecto `http://localhost:8080/api`).

---

## Endpoints de la API

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | Público | Registrar trabajador |
| POST | `/api/auth/login` | Público | Iniciar sesión |
| GET | `/api/usuarios/me` | Autenticado | Datos del usuario actual |
| POST | `/api/trabajos` | Autenticado | Registrar trabajo |
| GET | `/api/trabajos` | Autenticado | Listar trabajos propios |
| GET | `/api/trabajos/{id}` | Autenticado | Ver un trabajo propio |
| PUT | `/api/trabajos/{id}` | Autenticado | Editar trabajo |
| DELETE | `/api/trabajos/{id}` | Autenticado | Eliminar trabajo |
| POST | `/api/trabajos/{id}/verificacion` | Autenticado | Solicitar verificación |
| GET | `/api/verificaciones/{token}` | Público | Consultar solicitud de verificación |
| POST | `/api/verificaciones/{token}` | Público | Confirmar o rechazar |
| GET | `/api/historial/estadisticas` | Autenticado | Estadísticas del historial |
| GET | `/api/historial/reporte` | Autenticado | Reporte PDF |

## Reglas de negocio

1. Un trabajador solo puede ver y modificar sus propios trabajos.
2. Cada solicitud de verificación se responde una sola vez.
3. Un trabajo verificado no se puede editar ni eliminar.
4. Un trabajo con una verificación pendiente no se puede editar ni eliminar.
5. Solo los trabajos verificados cuentan en las estadísticas de clientes, meses y monto.
6. El valor debe ser mayor que 0 y la fecha no puede ser futura.
7. Los enlaces de verificación vencen a los 7 días.

## Decisiones de seguridad

- Contraseñas almacenadas con BCrypt; el rol lo asigna el servidor, no el cliente.
- El token JWT solo contiene el id y el rol del usuario; el secreto no está en el repositorio.
- El acceso a un trabajo ajeno responde 404, para no revelar si el recurso existe.
- La página de verificación consulta con GET y responde con POST, de modo que las vistas previas automáticas de enlaces (WhatsApp, correo) no confirman trabajos.
- Bloqueo optimista (`@Version`) para evitar dobles respuestas simultáneas.
- La respuesta pública de verificación no expone IDs, correo del trabajador ni contacto del cliente.

## Limitaciones conocidas

- El sistema no verifica la identidad del cliente: un trabajador podría enviarse el enlace a sí mismo. Por eso la plataforma no certifica ingresos.
- Los clientes distintos se cuentan por nombre normalizado.
- El token se guarda en `localStorage`; en producción convendría usar cookies `HttpOnly`.
- El esquema de la base de datos se genera con `ddl-auto=update`; en producción se usaría una herramienta de migraciones (Flyway o Liquibase).

## Capturas

[Agregar pantallazos: login, mis trabajos, solicitud de verificación, página del cliente, historial y PDF]
