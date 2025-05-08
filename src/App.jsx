import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './Screens/Login/LoginScreen.jsx';
import Header from './Screens/Login/Header.jsx'

import ResetPassword from './Screens/Login/ResetPassword.jsx'; // Importar la nueva página
import BackgroundCross from './components/BackgroundCross/BackgroundCross.jsx';

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
                            <Header />
                            <LoginScreen />
                        </BackgroundCross>
                    }
                />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
        </Router>
    );
}

export default App;