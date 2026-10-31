import api from "./client";

export const authApi = {
  login: (datos) => api.post("/auth/login", datos).then((r) => r.data),
  registrar: (datos) => api.post("/auth/register", datos).then((r) => r.data),
  me: () => api.get("/usuarios/me").then((r) => r.data),
};

export const trabajosApi = {
  listar: () => api.get("/trabajos").then((r) => r.data),
  obtener: (id) => api.get(`/trabajos/${id}`).then((r) => r.data),
  crear: (datos) => api.post("/trabajos", datos).then((r) => r.data),
  actualizar: (id, datos) => api.put(`/trabajos/${id}`, datos).then((r) => r.data),
  eliminar: (id) => api.delete(`/trabajos/${id}`),
  solicitarVerificacion: (id) => api.post(`/trabajos/${id}/verificacion`).then((r) => r.data),
};

export const verificacionApi = {
  consultar: (token) => api.get(`/verificaciones/${token}`).then((r) => r.data),
  responder: (token, datos) => api.post(`/verificaciones/${token}`, datos).then((r) => r.data),
};

export const historialApi = {
  estadisticas: () => api.get("/historial/estadisticas").then((r) => r.data),
  reporte: () => api.get("/historial/reporte", { responseType: "blob" }).then((r) => r.data),
};