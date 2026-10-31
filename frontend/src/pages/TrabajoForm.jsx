import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { trabajosApi } from "../api/endpoints";
import { erroresCampos, mensajeError } from "../api/errores";
import { hoyLocal } from "../utils/formato";

const VACIO = { nombreCliente: "", contactoCliente: "", servicio: "", fecha: "", valor: "" };

export default function TrabajoForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(VACIO);
  const [cargando, setCargando] = useState(editando);
  const [error, setError] = useState("");
  const [campos, setCampos] = useState({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!editando) return;
    trabajosApi.obtener(id)
      .then((t) => setForm({
        nombreCliente: t.nombreCliente,
        contactoCliente: t.contactoCliente ?? "",
        servicio: t.servicio,
        fecha: t.fecha,
        valor: t.valor,
      }))
      .catch((err) => setError(mensajeError(err)))
      .finally(() => setCargando(false));
  }, [id, editando]);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setCampos({});
    setEnviando(true);
    const datos = { ...form, valor: Number(form.valor) };
    try {
      if (editando) await trabajosApi.actualizar(id, datos);
      else await trabajosApi.crear(datos);
      navigate("/trabajos");
    } catch (err) {
      setError(mensajeError(err));
      setCampos(erroresCampos(err));
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <div className="contenedor-form">
      <h1>{editando ? "Editar trabajo" : "Registrar trabajo"}</h1>

      <form onSubmit={enviar}>
        <label>
          Nombre del cliente *
          <input name="nombreCliente" value={form.nombreCliente} onChange={cambiar} required maxLength={100} />
          {campos.nombreCliente && <small className="error">{campos.nombreCliente}</small>}
        </label>
        <label>
          Contacto del cliente (teléfono o correo)
          <input name="contactoCliente" value={form.contactoCliente} onChange={cambiar} maxLength={100} />
        </label>
        <label>
          Servicio realizado *
          <input name="servicio" value={form.servicio} onChange={cambiar} required maxLength={150}
                 placeholder="Ej: Aseo general de apartamento" />
          {campos.servicio && <small className="error">{campos.servicio}</small>}
        </label>
        <label>
          Fecha *
          <input type="date" name="fecha" value={form.fecha} onChange={cambiar} required max={hoyLocal()} />
          {campos.fecha && <small className="error">{campos.fecha}</small>}
        </label>
        <label>
          Valor cobrado (COP) *
          <input type="number" name="valor" value={form.valor} onChange={cambiar} required min={1} step={1} />
          {campos.valor && <small className="error">{campos.valor}</small>}
        </label>

        {error && <p className="error">{error}</p>}

        <div className="acciones">
          <button type="submit" disabled={enviando}>{enviando ? "Guardando..." : "Guardar"}</button>
          <Link to="/trabajos">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}