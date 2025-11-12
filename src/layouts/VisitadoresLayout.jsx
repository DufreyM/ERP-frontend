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
  { label: "Inicio", to: "/visitador_logged/", icon: faHome },
  { label: "Calendario", to: "/visitador_logged/calendario", icon: faCalendar },
  { label: "Visitadores médicos", to: "/visitador_logged/visitadores-medicos", icon: faTruckMedical },
  { label: "Mi perfil", to: "/visitador_logged/mi-perfil", icon: faUser },
];



export default function VisitadorLayout() {
  const { pathname } = useLocation();
  const token = getToken();

  //Decodificar el token
  const decoded = token ? jwtDecode(token) : null;
  // const localId = decoded?.local ?? null; // el campo puede llamarse distinto según backend

 
  //const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  //colores del fondo :D
  const variantMap = {
    "/visitador_logged/": "transparent",
    "/visitador_logged/mi-perfil": "blue",
    "/visitador_logged/visitadores-medicos": "transparent",
    "/visitador_logged/calendario": "blue",
  };

  //posiciones del fondo
  const variantMapPositionMirrored = {
    "/visitador_logged/": false,
    "/visitador_logged/mi-perfil": false,
    "/visitador_logged/visitadores-medicos": true,
    "/visitador_logged/calendario": false,
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

         

          {/* <Outlet context={{ selectedLocalk: localId }} /> */}
        </main>
      
      </div>
    </BackgroundCross>
  );
}
