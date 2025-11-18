// hooks/useAuth.js
import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService, storeToken, removeToken, getToken } from "../../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [isInitializing, setIsInitializing] = useState(true);

  

  // al montar, leemos token desde localStorage una vez
  useEffect(() => {
    const t = getToken();
    setToken(t);
    setIsInitializing(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginService(email, password);
    if (data.token) {
      storeToken(data.token);
      setToken(data.token);
    }
    return data;
  };


  const logout = () => {
    //console.log("🔒 Cerrando sesión...");
    removeToken();
    setToken(null);
 
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isInitializing  }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
