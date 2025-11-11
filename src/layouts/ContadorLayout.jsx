import { Outlet } from "react-router-dom";
import Navbar from '../components/Navbar/Navbar.jsx';
//import RightPanel from "../components/RightPanel/RightPanel.jsx";
import "./AdminLayout.css";
import {useState} from "react";
import { useLocation } from 'react-router-dom';
import { faHome, faBell, faFolder, faUser, faBoxOpen, faSackDollar, faTruckMedical, faCalendar, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import BackgroundCross from "../components/BackgroundCross/BackgroundCross.jsx";
import TabsLocales from "../components/TabsLocales/TabsLocales";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../services/authService.js";

const contadorItems = [
  { label: "Inicio", to: "/contador/", icon: faHome },
  //{ label: "Archivos", to: "/contador/archivos", icon: faFolder },
  { label: "Compras Ventas", to: "/contador/historial-vc", icon: faSackDollar },
  //{ label: "Empleados Clientes", to: "/contador/configurar-ec", icon: faUserGroup },
//   { label: "Inventario", to: "/contador/inventario", icon: faBoxOpen },
//   { label: "Calendario", to: "/contador/calendario", icon: faCalendar },
  //{ label: "Visitadores médicos", to: "/contador/visitadores-medicos", icon: faTruckMedical },
//    { label: "Alertas", to: "/contador/notificaciones", icon: faBell },
  { label: "Mi perfil", to: "/contador/mi-perfil", icon: faUser },
];



export default function ContadorLayout() {
  const { pathname } = useLocation();
  const token = getToken();

  //Decodificar el token
  const decoded = token ? jwtDecode(token) : null;
  const localId = decoded?.local ?? null; // el campo puede llamarse distinto según backend

 
  //const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  //colores del fondo :D
  const variantMap = {
    "/contador/": "transparent",
    "/contador/mi-perfil": "blue",
    "/contador/historial-vc": "transparent",
  };

  //posiciones del fondo
  const variantMapPositionMirrored = {
    "/contador/": false,
    "/contador/mi-perfil": false,
    "/contador/historial-vc": true,
  };

    const showTabsLocalesRoutes = [
    
    "/contador/historial-vc",
    "/contador/historial-vc/nueva-venta",
    "/contador/historial-vc/nueva-compra",
  ];

  const showTabsLocales = showTabsLocalesRoutes.includes(pathname);
  const variant = variantMap[pathname] || "default";
  const mirrored = variantMapPositionMirrored[pathname] || false;

  //pestañas de locales y guardar configuración de en donde estás
  const [selectedLocal, setSelectedLocal] = useState(() => {
    const storedLocal = localStorage.getItem("selectedLocal");
    return storedLocal !== null ? parseInt(storedLocal) : 0;
  });

  const locales = ["Local 1", "Local 2"];

  console.log("ContadorLayout renderizado; selectedLocal:", selectedLocal); //Luego quitar el print
  return (
    <BackgroundCross 
      variant={variantMap[pathname] || "default"} 
      mirrored={mirrored} 
      className="admin-background"
    >
      <div className={`admin-layout right-collapsed' : ''}`}>
        <Navbar items={contadorItems} />
        <main
          className="admin-content"
          >
{showTabsLocales && (
          <TabsLocales
            locales={locales}
            selectedLocal={selectedLocal}
            onSelect={(index) => {
              setSelectedLocal(index);
              localStorage.setItem("selectedLocal", index);
            }}
          />
          )}

         

          <Outlet context={{ selectedLocal }} />
        </main>
      
      </div>
    </BackgroundCross>
  );
}
