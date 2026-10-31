import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setCargando(false);
      return;
    }
    authApi.me()
      .then(setUsuario)
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setCargando(false));
  }, []);

  const guardarSesion = ({ token, usuario }) => {
    localStorage.setItem("token", token);
    setUsuario(usuario);
  };

  const login = async (datos) => guardarSesion(await authApi.login(datos));
  const registrar = async (datos) => guardarSesion(await authApi.registrar(datos));
  const logout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);