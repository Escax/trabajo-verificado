import { ClipboardList, FileText, Send, ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="auth">
      <aside className="auth-marca">
        <div className="logo"><ShieldCheck size={28} /> TrabajoVerificado</div>
        <h2>Tu trabajo habla por ti. Ahora también puedes demostrarlo.</h2>
        <ul className="pasos">
          <li>
            <div className="paso-icono"><ClipboardList size={20} /></div>
            <div>Registra tus trabajos<small>Cliente, servicio, fecha y valor.</small></div>
          </li>
          <li>
            <div className="paso-icono"><Send size={20} /></div>
            <div>Tus clientes los confirman<small>Con un enlace, sin crear cuenta.</small></div>
          </li>
          <li>
            <div className="paso-icono"><FileText size={20} /></div>
            <div>Descarga tu historial<small>Un PDF para mostrar tu constancia.</small></div>
          </li>
        </ul>
      </aside>
      <section className="auth-form">
        <div className="auth-caja">{children}</div>
      </section>
    </div>
  );
}