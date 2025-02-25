// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            const userSession = await AsyncStorage.getItem("userSession");
            if (userSession) {
                console.log(userSession);
                const parsedSession = JSON.parse(userSession);
                setIsAuthenticated(true);
                setUserRole(parsedSession.rol);
                console.log(userSession);
            } else {
                setIsAuthenticated(false);
                router.replace("/");
            }
        };
        checkSession();
    }, []);

    const login = async (userData) => {
        await AsyncStorage.setItem("userSession", JSON.stringify(userData));
        setIsAuthenticated(true);
        setUserRole(userData.rol);
    };

    const logout = async () => {
        await AsyncStorage.removeItem("userSession");
        setIsAuthenticated(false);
        setUserRole(null);
        router.replace("/");
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, userRole, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
