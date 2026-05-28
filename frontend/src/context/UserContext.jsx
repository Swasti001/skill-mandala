import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../user/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId || !token) {
            setLoading(false);
            return;
        }
        try {
            const res = await api.get('/user/me');
            setUser(res.data);
        } catch (err) {
            console.error('Failed to fetch user in context:', err);
            // If unauthorized, clear context
            if (err.response?.status === 401) {
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const refreshUser = useCallback(async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId || !token) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const res = await api.get('/user/me');
            setUser(res.data);
        } catch (err) {
            console.error('Failed to refresh user:', err);
            if (err.response?.status === 401) {
                setUser(null);
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        localStorage.removeItem('onboardingCompleted');
        localStorage.removeItem('currentOnboardingStep');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, refreshUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
