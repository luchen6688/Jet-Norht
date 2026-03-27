'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthPromptModal from '@/components/AuthPromptModal';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPromptOpen, setIsPromptOpen] = useState(false);
    const router = useRouter();

    const fetchSession = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/me', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    const login = (userData) => setUser(userData);
    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/');
        router.refresh();
    };

    const openPrompt = () => setIsPromptOpen(true);
    const closePrompt = () => setIsPromptOpen(false);

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login, 
            logout, 
            fetchSession,
            isPromptOpen,
            openPrompt,
            closePrompt
        }}>
            {children}
            <AuthPromptModal />
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
