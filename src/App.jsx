<<<<<<< Updated upstream
import { useEffect, useState } from 'react';
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './Screens/Login/LoginScreen.jsx';
import ResetPassword from './Screens/ResetPassword/ResetPassword.jsx';
import BackgroundCross from './components/BackgroundCross/BackgroundCross.jsx';
import RegisterScreen from './Screens/Register/Register.jsx';
import Visitadores from './Screens/Visitadores/Visitadores.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminDashboard from './Screens/dashboard/admin/Dashboard.jsx'
import MiPerfil from './Screens/MiPerfil/MiPerfil.jsx'; 
import ChangePassword from './Screens/ChangePassword/ChangePassword.jsx';
import ArchivosScreen from './Screens/Archivos/Archivos.jsx';
import EmpleadosClientes from './Screens/EmpleadosClientes/EmpleadosClientes.jsx';
import { CalendarScreen } from './Screens/Calendar/CalendarScreen.jsx';
import NewPassword from './Screens/ResetPassword/NewPassword.jsx';
import PasswordSuccess from './Screens/ResetPassword/PasswordSuccess.jsx'
import PrivateRoute from './components/authcomponent.jsx'; // Importa el componente de ruta privada
import VisitadoresAdmin from './Screens/Visitadores/VisitadoresAdmin.jsx';
import InventarioScreen from './Screens/Inventario/InventarioScreen.jsx';
import NuevaVenta from './Screens/NuevaVenta/NuevaVenta.jsx';
import HistorialComprasVentas from './Screens/HistorialComprasVentas/HistorialComprasVentas.jsx';
>>>>>>> Stashed changes

function App() {
  const [message, setMessage] = useState(null);

<<<<<<< Updated upstream
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage('Error al conectar con la API :('));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Frontend React + Vite</h1>
      <p>{message ? message : 'Cargando...'}</p> 
    </div>
  );
=======
                <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
                <Route index element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="mi-perfil" element={<MiPerfil />} />
                <Route path="cambiar-contraseña" element={<ChangePassword />} />
                <Route path="archivos" element={<ArchivosScreen />} />
                <Route path="configurar-ec" element={<EmpleadosClientes />} />
                <Route path="calendario" element={<CalendarScreen />} />
                <Route path="visitadores-medicos" element={<VisitadoresAdmin />} />
                <Route path="inventario" element={<InventarioScreen />} />
                <Route path="historial-vc" element={<HistorialComprasVentas />}></Route>
                <Route path= "historial-vc/nueva-venta" element={<NuevaVenta />}></Route>
                </Route>
            </Routes>
        </Router>
    );
>>>>>>> Stashed changes
}

export default App;
