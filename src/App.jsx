import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './Screens/Login/LoginScreen.jsx';
import Header from './Screens/Login/Header.jsx'
import LoginBackground from './components/BackgroundLeftCross/LoginBackground.jsx';
import ResetPassword from './Screens/Login/ResetPassword.jsx'; // Importar la nueva página

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <LoginBackground>
                            <Header />
                            <LoginScreen />
                        </LoginBackground>
                    }
                />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
        </Router>
    );
}

export default App;