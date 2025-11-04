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

const dependienteItems = [
  { label: "Inicio", to: "/dependiente/", icon: faHome },
  //{ label: "Archivos", to: "/dependiente/archivos", icon: faFolder },
  { label: "Compras Ventas", to: "/dependiente/historial-vc", icon: faSackDollar },
  //{ label: "Empleados Clientes", to: "/dependiente/configurar-ec", icon: faUserGroup },
  { label: "Inventario", to: "/dependiente/inventario", icon: faBoxOpen },
  { label: "Calendario", to: "/dependiente/calendario", icon: faCalendar },
  //{ label: "Visitadores médicos", to: "/dependiente/visitadores-medicos", icon: faTruckMedical },
   { label: "Alertas", to: "/dependiente/notificaciones", icon: faBell },
  { label: "Mi perfil", to: "/dependiente/mi-perfil", icon: faUser },
];



export default function DependienteLayout() {
  const { pathname } = useLocation();
  const token = getToken();

  //Decodificar el token
  const decoded = token ? jwtDecode(token) : null;
  const localId = decoded?.local ?? null; // el campo puede llamarse distinto según backend

 
  //const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  //colores del fondo :D
  const variantMap = {
    "/dependiente/": "transparent",
    "/dependiente/mi-perfil": "blue",
    "/dependiente/archivos": "orange",
    "/dependiente/historial-vc": "transparent",
    "/dependiente/inventario": "blue",
    "/dependiente/calendario": "transparent",
  };

  //posiciones del fondo
  const variantMapPositionMirrored = {
    "/dependiente/": false,
    "/dependiente/mi-perfil": false,
    "/dependiente/archivos": true,
    "/dependiente/inventario": true,
  };


  const variant = variantMap[pathname] || "default";
  const mirrored = variantMapPositionMirrored[pathname] || false;

//   //pestañas de locales y guardar configuración de en donde estás
//   const [selectedLocal, setSelectedLocal] = useState(() => {
//     const storedLocal = localStorage.getItem("selectedLocal");
//     return storedLocal !== null ? parseInt(storedLocal) : 0;
//   });

//   const locales = ["Local 1", "Local 2"];

  //console.log("AdminLayout renderizado; selectedLocal:", selectedLocal);
  return (
    <BackgroundCross 
      variant={variantMap[pathname] || "default"} 
      mirrored={mirrored} 
      className="admin-background"
    >
      <div className={`admin-layout right-collapsed' : ''}`}>
        <Navbar items={dependienteItems} />
        <main
          className="admin-content"
          >

         

          <Outlet context={{ selectedLocal: localId }} />
        </main>
      
      </div>
    </BackgroundCross>
  );
}
