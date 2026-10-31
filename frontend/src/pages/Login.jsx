import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mensajeError } from "../api/errores";
import AuthLayout from "../components/AuthLayout";

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
  <AuthLayout>
    <h1>Bienvenido de nuevo</h1>
    <p className="subtitulo">Ingresa para ver y gestionar tu historial de trabajos.</p>

    <form onSubmit={enviar}>
      <label>
        Correo
        <input type="email" name="correo" value={form.correo} onChange={cambiar}
               placeholder="tu@correo.com" required />
      </label>
      <label>
        Contraseña
        <input type="password" name="password" value={form.password} onChange={cambiar}
               placeholder="••••••••" required />
      </label>

      {error && <div className="alerta-error">{error}</div>}

      <button type="submit" disabled={enviando}>
        {enviando ? "Ingresando..." : "Ingresar"}
      </button>
    </form>

    <p className="auth-pie">¿No tienes cuenta? <Link to="/registro">Crea una gratis</Link></p>
  </AuthLayout>
);
}