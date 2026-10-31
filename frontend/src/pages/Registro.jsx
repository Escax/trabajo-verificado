import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { erroresCampos, mensajeError } from "../api/errores";

const OFICIOS = ["Aseo", "Domicilios", "Tutorías", "Oficios varios", "Otro"];

export default function Registro() {
  const { registrar, usuario } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "", correo: "", password: "", confirmar: "",
    oficio: "", ciudad: "", descripcion: "",
  });
  const [error, setError] = useState("");
  const [campos, setCampos] = useState({});
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to="/trabajos" replace />;

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setCampos({});
    if (form.password !== form.confirmar) {
      setCampos({ confirmar: "Las contraseñas no coinciden" });
      return;
    }
    setEnviando(true);
    try {
      const datos = { ...form };
      delete datos.confirmar;
      await registrar(datos);
      navigate("/trabajos");
    } catch (err) {
      setError(mensajeError(err));
      setCampos(erroresCampos(err));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="contenedor-auth">
      <h1>Crear cuenta</h1>

      <form onSubmit={enviar}>
        <label>
          Nombre completo *
          <input name="nombre" value={form.nombre} onChange={cambiar} required maxLength={100} />
          {campos.nombre && <small className="error">{campos.nombre}</small>}
        </label>
        <label>
          Correo *
          <input type="email" name="correo" value={form.correo} onChange={cambiar} required />
          {campos.correo && <small className="error">{campos.correo}</small>}
        </label>
        <label>
          Contraseña * (mínimo 8 caracteres)
          <input type="password" name="password" value={form.password} onChange={cambiar}
                 required minLength={8} maxLength={72} />
          {campos.password && <small className="error">{campos.password}</small>}
        </label>
        <label>
          Confirmar contraseña *
          <input type="password" name="confirmar" value={form.confirmar} onChange={cambiar} required />
          {campos.confirmar && <small className="error">{campos.confirmar}</small>}
        </label>
        <label>
          Oficio
          <select name="oficio" value={form.oficio} onChange={cambiar}>
            <option value="">Selecciona...</option>
            {OFICIOS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
        <label>
          Ciudad
          <input name="ciudad" value={form.ciudad} onChange={cambiar} />
        </label>
        <label>
          Descripción
          <textarea name="descripcion" value={form.descripcion} onChange={cambiar} maxLength={500} rows={3} />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  );
}