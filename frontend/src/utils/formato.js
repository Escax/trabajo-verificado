const pesos = new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", maximumFractionDigits: 0,
});

export const formatoPesos = (valor) => pesos.format(valor ?? 0);

// "2026-10-25" → "25/10/2026" sin pasar por new Date()
export const formatoFecha = (iso) => {
  if (!iso) return "—";
  const [a, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
};

// Fecha de hoy en hora local, formato "YYYY-MM-DD"
export const hoyLocal = () => {
  const h = new Date();
  return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, "0")}-${String(h.getDate()).padStart(2, "0")}`;
};

export const ETIQUETA_ESTADO = {
  PENDIENTE: "Pendiente",
  VERIFICADO: "Verificado",
  RECHAZADO: "Rechazado",
};