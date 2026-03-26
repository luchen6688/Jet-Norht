'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
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
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        // Verificar sesión desde la API (cookie HttpOnly)
        fetchSession();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchSession]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } finally {
            setUser(null);
            router.push('/');
            router.refresh();
        }
    };

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
            <div className={styles.logo}>
                <Link href="/">North Airways</Link>
            </div>

            <ul className={styles.navLinks}>
                <li className={styles.navLink}><Link href="/reservar">Reservar</Link></li>
                <li className={styles.navLink}><Link href="/mis-viajes">Mis Viajes</Link></li>
                <li className={styles.navLink}><Link href="/check-in">Check-In</Link></li>
                <li className={styles.navLink}><Link href="/info">Información de Viaje</Link></li>
            </ul>

            <div className={styles.authButtons}>
                {loading ? (
                    <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>...</span>
                ) : user ? (
                    <>
                        <span className={styles.userName}>Hola, {user.name.split(' ')[0]}</span>
                        <button onClick={handleLogout} className={styles.btnJoin}>Salir</button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className={styles.btnSign}>Iniciar Sesión</Link>
                        <Link href="/registro" className={styles.btnJoin}>Registrarse</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
