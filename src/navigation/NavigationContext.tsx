import { createContext, useContext, useState } from "react";

const NavigationContext = createContext();

export function NavigationProvider({ children }) {
    const [breadcrumb, setBreadcrumb] = useState({
        asignatura: null,
        grupo: null,
        tema: null,
        actividad: null,
        alumno: null
    });

    const updateBreadcrumb = (level, value) => {
        setBreadcrumb(prev => ({
            ...prev,
            [level]: value,
            // limpia niveles posteriores
            ...(level === "asignatura" && { grupo: null, tema: null, actividad: null, alumno: null }),
            ...(level === "grupo" && { tema: null, actividad: null, alumno: null }),
            ...(level === "tema" && { actividad: null, alumno: null }),
            ...(level === "actividad" && { alumno: null })
        }));
    };

    return (
        <NavigationContext.Provider value={{ breadcrumb, updateBreadcrumb }}>
            {children}
        </NavigationContext.Provider>
    );
}

export const useNavigation = () => useContext(NavigationContext);
