import { Outlet } from "react-router-dom";
import Navbar from '../components/Navbar/Navbar.jsx'
import "./AdminLayout.css";
import { FaUser, FaBox, FaCalendar, FaUsers, FaCog } from "react-icons/fa";

const adminItems = [
  { label: "Mi perfil", to: "/admin/perfil", icon: FaUser },
  { label: "Calendario", to: "/admin/calendario", icon: FaCalendar },
  { label: "Visitadores médicos", to: "/admin/visitadores", icon: FaUsers },
  { label: "Configurar perfiles", to: "/admin/perfiles", icon: FaCog },
  { label: "Inventario", to: "/admin/inventario", icon: FaBox },
];

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Navbar items={adminItems} />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
