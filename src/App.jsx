import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './Screens/Login/LoginScreen.jsx';
import Header from './Screens/Login/Header.jsx'

import ResetPassword from './Screens/ResetPassword/ResetPassword.jsx'; // Importar la nueva página
import BackgroundCross from './components/BackgroundCross/BackgroundCross.jsx';
import RegisterScreen from './Screens/Register/Register.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <BackgroundCross
                        BackgroundCross
            variant="red" mirrored={false}
                        >
                        
                            <LoginScreen />
                        </BackgroundCross>
                    }
                />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/register-user" element={
                    <BackgroundCross
                        variant="red"
                    >
                        <RegisterScreen>

                        </RegisterScreen>
                    </BackgroundCross>
                }/>
            </Routes>
        </Router>
    );
}

export default App;