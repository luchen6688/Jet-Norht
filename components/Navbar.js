'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

import { useAuth } from '@/lib/AuthContext';
export default function Navbar() {
    const pathname = usePathname();
    const { user, loading, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (pathname?.startsWith('/admin')) {
        return null;
    }

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
                        <button onClick={logout} className={styles.btnJoin}>Salir</button>
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
