import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav>
        <strong>TrabajoVerificado</strong>
        <Link to="/trabajos">Mis trabajos</Link>
        <Link to="/historial">Historial</Link>
        <span>{usuario?.nombre}</span>
        <button onClick={salir}>Salir</button>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}