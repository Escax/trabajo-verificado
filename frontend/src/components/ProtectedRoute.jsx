import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { usuario, cargando } = useAuth();
  if (cargando) return <p>Cargando...</p>;
  return usuario ? <Outlet /> : <Navigate to="/login" replace />;
}