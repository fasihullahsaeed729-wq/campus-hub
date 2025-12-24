import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const response = await authAPI.checkSession();
            if (response.data.loggedIn) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Session check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const response = await authAPI.login(credentials);
        setUser(response.data.user);
        return response.data;
    };

    const register = async (userData) => {
        const response = await authAPI.register(userData);
        return response.data;
    };

    const logout = async () => {
        await authAPI.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        checkSession
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};