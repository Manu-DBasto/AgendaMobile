import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const AuthContext = createContext({
    userRole: null,
    setUserRole: () => {},
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    handleLogout: () => {}, // Función para cerrar sesión
});

export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const userSession = await AsyncStorage.getItem("userSession");
            if (userSession) {
                const parsedSession = JSON.parse(userSession);
                console.log(userSession);
                setIsAuthenticated(true);
                setUserRole(parsedSession.rol);
            } else {
                setIsAuthenticated(false);
                router.replace("/"); // Redirige a login si no hay sesión
            }
        };
        checkSession();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("userSession");
        setUserRole(null);
        router.replace("/");
    };

    return (
        <AuthContext.Provider
            value={{
                userRole,
                setUserRole,
                isAuthenticated,
                setIsAuthenticated,
                handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
