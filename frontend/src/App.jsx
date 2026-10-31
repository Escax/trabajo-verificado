import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Trabajos from "./pages/Trabajos";
import TrabajoForm from "./pages/TrabajoForm";
import Historial from "./pages/Historial";
import Verificar from "./pages/Verificar";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/verificar/:token" element={<Verificar />} />

          {/* Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/trabajos" element={<Trabajos />} />
              <Route path="/trabajos/nuevo" element={<TrabajoForm />} />
              <Route path="/trabajos/:id/editar" element={<TrabajoForm />} />
              <Route path="/historial" element={<Historial />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/trabajos" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}