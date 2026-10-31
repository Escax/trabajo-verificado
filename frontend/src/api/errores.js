export function mensajeError(err) {
  const data = err.response?.data;
  return data?.mensaje ?? data?.message ?? "Ocurrió un error. Intenta de nuevo.";
}

export function erroresCampos(err) {
  return err.response?.data?.errores ?? {};
}