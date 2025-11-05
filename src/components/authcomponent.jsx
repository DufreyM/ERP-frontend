// import { Navigate } from 'react-router-dom';

// const isAuthenticated = () => {
//   // return localStorage.getItem('jwtToken') !== null;
//   return true; // siempre devuelve true para permitir acceso
// };

// const PrivateRoute = ({ children }) => {
//   // return isAuthenticated() ? children : <Navigate to="/" replace />;
//   return children; // siempre permite acceso sin redirección
// };

// export default PrivateRoute;


// authcomponent.jsx
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return localStorage.getItem("jwtToken") !== null;
};

const PrivateRoute = ({ children }) => {
  // si estamos en desarrollo, deja pasar siempre
  if (import.meta.env.MODE === "development") {
    return children;
  }

  // en producción, sí valida el token
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;

