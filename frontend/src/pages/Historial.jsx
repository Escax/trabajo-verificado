import { useEffect, useState } from "react";
import { historialApi } from "../api/endpoints";
import { mensajeError } from "../api/errores";
import { formatoFecha, formatoPesos } from "../utils/formato";
import Aviso from "../components/Aviso";

export default function Historial() {
  const [e, setE] = useState(null);
  const [error, setError] = useState("");
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    historialApi.estadisticas()
      .then(setE)
      .catch((err) => setError(mensajeError(err)));
  }, []);

  const descargar = async () => {
    setError("");
    setDescargando(true);
    try {
      const blob = await historialApi.reporte();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "historial-trabajos.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("No se pudo generar el reporte. Intenta de nuevo.");
    } finally {
      setDescargando(false);
    }
  };

  if (error && !e) return <p className="error">{error}</p>;
  if (!e) return <p>Cargando...</p>;

  return (
    <>
      <div className="encabezado">
        <h1>Mi historial</h1>
        <button onClick={descargar} disabled={descargando}>
          {descargando ? "Generando..." : "Descargar PDF"}
        </button>
      </div>

      <Aviso />
      {error && <p className="error">{error}</p>}

      <div className="estadisticas">
        <Dato titulo="Trabajos verificados" valor={e.trabajosVerificados} destacado />
        <Dato titulo="Monto verificado" valor={formatoPesos(e.montoTotalVerificado)} destacado />
        <Dato titulo="Clientes distintos" valor={e.clientesDistintos} />
        <Dato titulo="Meses con actividad" valor={e.mesesActividad} />
        <Dato titulo="Trabajos registrados" valor={e.trabajosRegistrados} />
        <Dato titulo="Pendientes" valor={e.trabajosPendientes} />
        <Dato titulo="Rechazados" valor={e.trabajosRechazados} />
      </div>

      <p className="nota">
        Periodo verificado: {formatoFecha(e.primerTrabajoVerificado)} a {formatoFecha(e.ultimoTrabajoVerificado)}.
        Solo los trabajos confirmados por el cliente cuentan como verificados.
      </p>
    </>
  );
}

function Dato({ titulo, valor, destacado }) {
  return (
    <div className={`dato ${destacado ? "dato-destacado" : ""}`}>
      <span className="dato-valor">{valor}</span>
      <span className="dato-titulo">{titulo}</span>
    </div>
  );
}