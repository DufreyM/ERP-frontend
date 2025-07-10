import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './Screens/Login/LoginScreen.jsx';
import ResetPassword from './Screens/ResetPassword/ResetPassword.jsx';
import BackgroundCross from './components/BackgroundCross/BackgroundCross.jsx';
import RegisterScreen from './Screens/Register/Register.jsx';
import Visitadores from './Screens/Visitadores/Visitadores.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminDashboard from './Screens/dashboard/admin/Dashboard.jsx'
import MiPerfil from './Screens/MiPerfil/MiPerfil.jsx'; 
import ArchivosScreen from './Screens/Archivos/Archivos.jsx';
import { CalendarScreen } from './Screens/Calendar/CalendarScreen.jsx';
import NewPassword from './Screens/ResetPassword/NewPassword.jsx';
import PasswordSuccess from './Screens/ResetPassword/PasswordSuccess.jsx'
import PrivateRoute from './components/authcomponent.jsx'; // Importa el componente de ruta privada

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
                <Route path="archivos" element={<ArchivosScreen />} />
                <Route path="calendario" element={<CalendarScreen />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;