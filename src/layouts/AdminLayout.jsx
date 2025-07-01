import { Outlet } from "react-router-dom";
import Navbar from '../components/Navbar/Navbar.jsx';
import RightPanel from "../components/RightPanel/RightPanel.jsx";
import "./AdminLayout.css";
import {useState} from "react";
import { useLocation } from 'react-router-dom';
import { IoIosNotifications, IoIosHome } from "react-icons/io";
import { IoMdArchive } from "react-icons/io";
import { FaUser, FaBox, FaClock, FaCalendar, FaUsers, FaCog } from "react-icons/fa";
import BackgroundCross from "../components/BackgroundCross/BackgroundCross.jsx";
import TabsLocales from "../components/TabsLocales/TabsLocales";

const adminItems = [
  { label: "Inicio", to: "/admin/", icon: IoIosHome },
  { label: "Notificaciones", to: "/admin/notificaciones", icon: IoIosNotifications },
  { label: "Archivos", to: "/admin/archivos", icon: IoMdArchive },
  { label: "Mi perfil", to: "/admin/mi-perfil", icon: FaUser },
  { label: "Historial (Ventas/compras)", to: "/admin/historial-vc", icon: FaClock },
  { label: "Configurar empleados/clientes", to: "/admin/configurar-ec", icon: FaCog },
  { label: "Inventario", to: "/admin/inventario", icon: FaBox },
  { label: "Calendario", to: "/admin/calendario", icon: FaCalendar },
  { label: "Visitadores médicos", to: "/admin/visitadores-medicos", icon: FaUsers },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  const variantMap = {
    "/admin/dashboard": "blue",
    "/admin/mi-perfil": "blue",
    "/admin/archivos": "orange",
    "/admin/calendario": "yellow",
  };

  const variant = variantMap[pathname] || "default";
  const [selectedLocal, setSelectedLocal] = useState(0);
  const locales = ["Local 1", "Local 2"];

  return (
    <BackgroundCross variant={variantMap[pathname] || "default"} className="admin-background">
        <div className={`admin-layout ${rightPanelCollapsed ? 'right-collapsed' : ''}`}>
        <Navbar items={adminItems} />
        <main
          className="admin-content">
          <TabsLocales
            locales={locales}
            selectedLocal={selectedLocal}
            onSelect={setSelectedLocal}
          />
          <Outlet context={{ selectedLocal }} />
        </main>
        <RightPanel
          collapsed={rightPanelCollapsed}
          setCollapsed={setRightPanelCollapsed}
        />
      </div>
    </BackgroundCross>
  );
}
