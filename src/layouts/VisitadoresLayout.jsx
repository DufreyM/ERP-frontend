//FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA FALTA 

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

const visitadorItems = [
  { label: "Inicio", to: "/visitador/", icon: faHome },
  //{ label: "Archivos", to: "/visitador/archivos", icon: faFolder },
  // { label: "Compras Ventas", to: "/visitador/historial-vc", icon: faSackDollar },
  //{ label: "Empleados Clientes", to: "/visitador/configurar-ec", icon: faUserGroup },
//   { label: "Inventario", to: "/visitador/inventario", icon: faBoxOpen },
  { label: "Calendario", to: "/visitador/calendario", icon: faCalendar },
  { label: "Visitadores médicos", to: "/visitador/visitadores-medicos", icon: faTruckMedical },
//    { label: "Alertas", to: "/visitador/notificaciones", icon: faBell },
  { label: "Mi perfil", to: "/visitador/mi-perfil", icon: faUser },
];



export default function VisitadorLayout() {
  const { pathname } = useLocation();
  const token = getToken();

  //Decodificar el token
  const decoded = token ? jwtDecode(token) : null;
  const localId = decoded?.local ?? null; // el campo puede llamarse distinto según backend

 
  //const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  //colores del fondo :D
  const variantMap = {
    "/visitador/": "transparent",
    "/visitador/mi-perfil": "blue",
    "/visitador/historial-vc": "transparent",
  };

  //posiciones del fondo
  const variantMapPositionMirrored = {
    "/visitador/": false,
    "/visitador/mi-perfil": false,
    "/visitador/historial-vc": true,
  };


  const variant = variantMap[pathname] || "default";
  const mirrored = variantMapPositionMirrored[pathname] || false;

  // //pestañas de locales y guardar configuración de en donde estás
  // const [selectedLocal, setSelectedLocal] = useState(() => {
  //   const storedLocal = localStorage.getItem("selectedLocal");
  //   return storedLocal !== null ? parseInt(storedLocal) : 0;
  // });

  // const locales = ["Local 1", "Local 2"];

  // console.log("VisitadorLayout renderizado; selectedLocal:", selectedLocal); 
  return (
    <BackgroundCross 
      variant={variantMap[pathname] || "default"} 
      mirrored={mirrored} 
      className="admin-background"
    >
      <div className={`admin-layout right-collapsed' : ''}`}>
        <Navbar items={visitadorItems} />
        <main
          className="admin-content"
          >

         

          <Outlet context={{ selectedLocal: localId }} />
        </main>
      
      </div>
    </BackgroundCross>
  );
}
