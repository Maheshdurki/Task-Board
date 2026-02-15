import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage or session storage for existing session
        const storedUser = localStorage.getItem('taskBoardUser') || sessionStorage.getItem('taskBoardUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password, rememberMe) => {
        if (email === 'intern@demo.com' && password === 'intern123') {
            const userData = { email, name: 'Intern User' };
            setUser(userData);

            if (rememberMe) {
                localStorage.setItem('taskBoardUser', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('taskBoardUser', JSON.stringify(userData));
            }
            return { success: true };
        } else {
            return { success: false, message: 'Invalid credentials' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('taskBoardUser');
        sessionStorage.removeItem('taskBoardUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
