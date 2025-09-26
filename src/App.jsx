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
import { CalendarScreen } from './Screens/Calendar/CalendarScreen.jsx';
import NewPassword from './Screens/ResetPassword/NewPassword.jsx';
import PasswordSuccess from './Screens/ResetPassword/PasswordSuccess.jsx'
import PrivateRoute from './components/authcomponent.jsx'; // Importa el componente de ruta privada
import VisitadoresAdmin from './Screens/Visitadores/VisitadoresAdmin.jsx';
import InventarioScreen from './Screens/Inventario/InventarioScreen.jsx';
import NuevaVenta from './Screens/NuevaVenta/NuevaVenta.jsx';
import HistorialComprasVentas from './Screens/HistorialComprasVentas/HistorialComprasVentas.jsx';
import EmpleadosClientes from './Screens/Empleados/EmpleadosClientes.jsx';
import NuevaCompra from './Screens/NuevaCompra/NuevaCompra.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <BackgroundCross variant="red" mirrored={false}>
                            <LoginScreen />
                        </BackgroundCross>
                    }
                />
                <Route
                    path="/visitador"
                    element={
                        <BackgroundCross variant="green" mirrored={true}>
                            <Visitadores />
                        </BackgroundCross>
                    }
                />
                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />
                <Route
                    path="/register-user"
                    element={
                        <BackgroundCross variant="red">
                            <RegisterScreen />
                        </BackgroundCross>
                    }
                />
                <Route
                    path="/auth/verify-reset"
                    element={<NewPassword />}
                />
                <Route
                    path="/reset-password-success"
                    element={<PasswordSuccess />}
                />

                <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
                <Route index element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="mi-perfil" element={<MiPerfil />} />
                <Route path="cambiar-contraseña" element={<ChangePassword />} />
                <Route path="archivos" element={<ArchivosScreen />} />
                <Route path="calendario" element={<CalendarScreen />} />
                <Route path="visitadores-medicos" element={<VisitadoresAdmin />} />
                <Route path="inventario" element={<InventarioScreen />} />
                <Route path="historial-vc" element={<HistorialComprasVentas />}></Route>
                <Route path= "historial-vc/nueva-venta" element={<NuevaVenta />}></Route>
                <Route path= "historial-vc/nueva-compra" element={<NuevaCompra />}></Route>
                <Route path="configurar-ec" element={<EmpleadosClientes />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;