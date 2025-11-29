// auth/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { loginUser, logoutUser, isAuthenticated } from "../Service/AuthService";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(isAuthenticated());
    
    const login = async (username:string, password:string) => {
        await loginUser(username, password);
        setLoggedIn(true);
    };

    const logout = () => {
        logoutUser();
        setLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ loggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
