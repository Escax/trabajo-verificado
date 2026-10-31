import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Briefcase, LogOut, ShieldCheck, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const claseMenu = ({ isActive }) => (isActive ? "activo" : "");

export default function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="barra">
        <div className="barra-contenido">
          <div className="logo">
            <ShieldCheck size={22} /> <span className="logo-texto">TrabajoVerificado</span>
          </div>
          <nav className="menu">
            <NavLink to="/trabajos" className={claseMenu}>
              <Briefcase size={16} /> <span className="menu-texto">Mis trabajos</span>
            </NavLink>
            <NavLink to="/historial" className={claseMenu}>
              <TrendingUp size={16} /> <span className="menu-texto">Historial</span>
            </NavLink>
          </nav>
          <div className="usuario">
            <span className="usuario-nombre">{usuario?.nombre}</span>
            <div className="avatar">{usuario?.nombre?.charAt(0).toUpperCase()}</div>
            <button className="icono" onClick={salir} title="Cerrar sesión">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}