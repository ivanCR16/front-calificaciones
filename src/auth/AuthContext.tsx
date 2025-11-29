// auth/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { loginUser, logoutUser, isAuthenticated } from "../Service/AuthService";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(isAuthenticated());
    const [docente, setDocente ] = useState({});
    
    const login = async (username:string, password:string) => {
        const user = await loginUser(username, password);
        setDocente(user);
        setLoggedIn(true);
    };

    const logout = () => {
        logoutUser();
        setLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ loggedIn, user:docente, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
