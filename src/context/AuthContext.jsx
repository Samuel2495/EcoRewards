import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const HUB_ADMINS = [
        { username: 'admin_vytilla', password: 'eco2024', name: 'Vytilla Hub Admin', hubCode: 'VYT-HUB' },
        { username: 'admin_infopark', password: 'eco2024', name: 'InfoPark Hub Admin', hubCode: 'INF-HUB' },
        { username: 'admin_kalamassery', password: 'eco2024', name: 'Kalamassery Hub Admin', hubCode: 'KLM-HUB' },
        { username: 'admin_hmt', password: 'eco2024', name: 'HMT Hub Admin', hubCode: 'HMT-HUB' },
        { username: 'admin_fortkochi', password: 'eco2024', name: 'Fort Kochi Hub Admin', hubCode: 'FTK-HUB' }
    ];

    const login = (username, password, type = 'user') => {
        if (type === 'admin') {
            if (username === 'admin_123' && password === 'admin123') {
                const adminUser = { username, role: 'admin', fullName: 'Super Administrator' };
                setUser(adminUser);
                localStorage.setItem('currentUser', JSON.stringify(adminUser));
                return { success: true };
            }

            const hubAdmin = HUB_ADMINS.find(admin => admin.username === username && admin.password === password);
            if (hubAdmin) {
                const adminUser = {
                    username: hubAdmin.username,
                    role: 'admin',
                    fullName: hubAdmin.name,
                    hubCode: hubAdmin.hubCode
                };
                setUser(adminUser);
                localStorage.setItem('currentUser', JSON.stringify(adminUser));
                return { success: true };
            }
        } else {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const foundUser = users.find(u => u.username === username && u.password === password);
            if (foundUser) {
                setUser(foundUser);
                localStorage.setItem('currentUser', JSON.stringify(foundUser));
                return { success: true };
            }
        }
        return { success: false, message: 'Invalid credentials' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const signup = (userData) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.username === userData.username)) {
            return { success: false, message: 'Username already exists' };
        }

        const newUser = {
            ...userData,
            id: Date.now().toString(),
            role: 'user',
            points: 0,
            credits: 0,
            tasks: []
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return { success: true };
    };

    const updateUser = (updates) => {
        if (!user) return;

        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map(u => u.username === user.username ? updatedUser : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        return true;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, loading, updateUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
