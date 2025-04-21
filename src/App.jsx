import { useEffect, useState } from 'react';
import LoginScreen from './Screens/Login/LoginScreen.jsx';
import LoginBackground from './Screens/Login/LoginBackground.jsx';
function App() {
    return (
      <div>
        <LoginBackground>
          <LoginScreen />
        </LoginBackground>
        
        

      </div>
      
    );
  }

export default App;
