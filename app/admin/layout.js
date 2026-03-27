'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Admin.module.css';

export default function AdminLayout({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    if (data.user && data.user.role === 'admin') {
                        setUser(data.user);
                        setLoading(false);
                    } else {
                        router.push('/login?callback=/admin');
                    }
                } else {
                    router.push('/login?callback=/admin');
                }
            } catch (err) {
                router.push('/login?callback=/admin');
            }
        };
        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    if (loading) {
        return (
            <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <p style={{ marginTop: '1rem', color: '#002d72' }}>Verificando credenciales...</p>
            </div>
        );
    }

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: '⚡' },
        { name: 'Reservaciones', path: '/admin/reservas', icon: '📅' },
        { name: 'Usuarios', path: '/admin/usuarios', icon: '👤' },
        { name: 'Pagos y Finanzas', path: '/admin/pagos', icon: '💰' },
        { name: 'Operaciones', path: '/admin/vuelos', icon: '✈️' },
        { name: 'Auditoría', path: '/admin/auditoria', icon: '🛡️' },
    ];

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>North Airways</h2>
                    <span>Panel de Control</span>
                </div>
                <nav className={styles.nav}>
                    {menuItems.map((item) => (
                        <Link 
                            key={item.path} 
                            href={item.path}
                            className={`${styles.navLink} ${pathname === item.path ? styles.navLinkActive : ''}`}
                        >
                            <span style={{ fontSize: '1.2rem', marginRight: '12px' }}>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className={styles.sidebarFooter}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <span>🚪</span> Cerrar Sesión
                    </button>
                </div>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.pageHeader}>
                    <div className={styles.pageTitle}>
                        <h1>{menuItems.find(m => m.path === pathname)?.name || 'Administración'}</h1>
                        <p>Bienvenido al sistema de gestión centralizada</p>
                    </div>
                    <div className={styles.userInfo}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, color: '#002d72', fontSize: '0.95rem' }}>{user.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>ADMINISTRATOR</div>
                        </div>
                        <div className={styles.userBadge}>
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
}
