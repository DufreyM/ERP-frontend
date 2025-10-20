import { Outlet } from "react-router-dom";
import Navbar from '../components/Navbar/Navbar.jsx';
//import RightPanel from "../components/RightPanel/RightPanel.jsx";
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
   { label: "Alertas", to: "/admin/notificaciones", icon: faBell },
  { label: "Mi perfil", to: "/admin/mi-perfil", icon: faUser },
];



export default function AdminLayout() {
  const { pathname } = useLocation();
 
  //const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  //colores del fondo :D
  const variantMap = {
    "/admin/dashboard": "blue",
    "/admin/mi-perfil": "blue",
    "/admin/archivos": "orange",
    "/admin/historial-vc": "transparent",
    "/admin/configurar-ec": "blue",
    "/admin/inventario": "blue",
    "/admin/calendario": "transparent",
    "/admin/visitadores-medicos": "blue",
  };

  //posiciones del fondo
  const variantMapPositionMirrored = {
    "/admin/dashboard": false,
    "/admin/mi-perfil": false,
    "/admin/archivos": true,
    "/admin/configurar-ec": true,
    "/admin/inventario": true,
    "/admin/visitadores-medicos": true,

  };

  //las rutas que tiene locales
  const showTabsLocalesRoutes = [
    "/admin/",
    "/admin/dashboard",
    "/admin/inventario",
    "/admin/historial-vc",
    "/admin/historial-vc/nueva-venta",
    "/admin/historial-vc/nueva-compra",
    "/admin/configurar-ec",
    "/admin/calendario",
    "/admin/archivos",
    "/admin/notificaciones",
    //"/admin/mi-perfil",
    //"/admin/visitadores-medicos",
  ];

  // Chequear si la ruta actual debe mostrar los tabs
  const showTabsLocales = showTabsLocalesRoutes.includes(pathname);


  const variant = variantMap[pathname] || "default";
  const mirrored = variantMapPositionMirrored[pathname] || false;

  const [selectedLocal, setSelectedLocal] = useState(0);
  const locales = ["Local 1", "Local 2"];

  console.log("AdminLayout renderizado; selectedLocal:", selectedLocal);
  return (
    <BackgroundCross 
      variant={variantMap[pathname] || "default"} 
      mirrored={mirrored} 
      className="admin-background"
    >
      <div className={`admin-layout right-collapsed' : ''}`}>
        <Navbar items={adminItems} />
        <main
          className="admin-content"
          >

          {showTabsLocales && (
          <TabsLocales
            locales={locales}
            selectedLocal={selectedLocal}
            onSelect={setSelectedLocal}
          />
          )}

          <Outlet context={{ selectedLocal,
            //  rightPanelCollapsed
             }} />
        </main>
        {/* <RightPanel
          collapsed={rightPanelCollapsed}
          setCollapsed={setRightPanelCollapsed}
        /> */}
      </div>
    </BackgroundCross>
  );
}
