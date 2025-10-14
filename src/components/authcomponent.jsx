// import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  // return localStorage.getItem('jwtToken') !== null;
  return true; // siempre devuelve true para permitir acceso
};

const PrivateRoute = ({ children }) => {
  // return isAuthenticated() ? children : <Navigate to="/" replace />;
  return children; // siempre permite acceso sin redirección
};

export default PrivateRoute;
