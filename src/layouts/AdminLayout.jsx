import { Outlet } from "react-router-dom";
import Navbar from '../components/Navbar/Navbar.jsx';
import RightPanel from "../components/RightPanel/RightPanel.jsx";
import "./AdminLayout.css";
import {useState} from "react";
import { useLocation } from 'react-router-dom';
import { faHome, faBell, faFolder, faUser, faBoxOpen, faSackDollar, faTruckMedical, faCalendar, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import BackgroundCross from "../components/BackgroundCross/BackgroundCross.jsx";
import TabsLocales from "../components/TabsLocales/TabsLocales";

const adminItems = [
  { label: "Inicio", to: "/admin/", icon: faHome },
  { label: "Archivos", to: "/admin/archivos", icon: faFolder },
  { label: "Compras Ventas", to: "/admin/historial-vc", icon: faSackDollar },
  { label: "Empleados Clientes", to: "/admin/configurar-ec", icon: faUserGroup },
  { label: "Inventario", to: "/admin/inventario", icon: faBoxOpen },
  { label: "Calendario", to: "/admin/calendario", icon: faCalendar },
  { label: "Visitadores médicos", to: "/admin/visitadores-medicos", icon: faTruckMedical },
   { label: "Notificaciones", to: "/admin/notificaciones", icon: faBell },
  { label: "Mi perfil", to: "/admin/mi-perfil", icon: faUser },
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

  console.log("AdminLayout renderizado; selectedLocal:", selectedLocal);
  return (
    <BackgroundCross variant={variantMap[pathname] || "default"} className="admin-background">
      <div className={`admin-layout ${rightPanelCollapsed ? 'right-collapsed' : ''}`}>
        <Navbar items={adminItems} />
        <main
          className="admin-content"
          style={pathname === '/admin/archivos' ? {overflowY: 'hidden'}: {}}
          
          >
          <TabsLocales
            locales={locales}
            selectedLocal={selectedLocal}
            onSelect={setSelectedLocal}
          />
          <Outlet context={{ selectedLocal, rightPanelCollapsed}} />
        </main>
        <RightPanel
          collapsed={rightPanelCollapsed}
          setCollapsed={setRightPanelCollapsed}
        />
      </div>
    </BackgroundCross>
  );
}
