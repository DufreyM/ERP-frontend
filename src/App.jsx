import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './Screens/Login/LoginScreen.jsx';
import ResetPassword from './Screens/ResetPassword/ResetPassword.jsx';
import BackgroundCross from './components/BackgroundCross/BackgroundCross.jsx';
import RegisterScreen from './Screens/Register/Register.jsx';
import Visitadores from './Screens/Visitadores/Visitadores.jsx';
import NewPassword from './Screens/ResetPassword/NewPassword.jsx';
import PasswordSuccess from './Screens/ResetPassword/PasswordSuccess.jsx'

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
            </Routes>
        </Router>
    );
}

export default App;