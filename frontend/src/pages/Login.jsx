import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mensajeError } from "../api/errores";

export default function Login() {
  const { login, usuario } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: "", password: "" });
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to="/trabajos" replace />;

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await login(form);
      navigate("/trabajos");
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="contenedor-auth">
      <h1>TrabajoVerificado</h1>
      <p>Construye un historial verificable de tus trabajos.</p>

      <form onSubmit={enviar}>
        <label>
          Correo
          <input type="email" name="correo" value={form.correo} onChange={cambiar} required />
        </label>
        <label>
          Contraseña
          <input type="password" name="password" value={form.password} onChange={cambiar} required />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p>¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
    </div>
  );
}