'use client';

import Navbar from '@/components/Navbar';
import styles from '../shared.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Mostrar aviso si la sesión expiró
        if (searchParams.get('expired') === '1') {
            setError('Tu sesión ha expirado. Por favor inicia sesión de nuevo.');
        }
    }, [searchParams]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // La cookie se guarda automáticamente — no usamos localStorage
            const redirect = searchParams.get('redirect') || '/';
            router.push(redirect);
            router.refresh(); // Fuerza actualización del Navbar
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.pageContainer}>
            <Navbar />
            <div className={styles.heroHeader}>
                <h1 className={styles.title}>Iniciar Sesión</h1>
                <p className={styles.subtitle}>Accede a tu cuenta de North Airways para gestionar reservas.</p>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.contentCard}>
                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.4)',
                            color: '#fca5a5',
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            marginBottom: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}
                    <form className={styles.authForm} onSubmit={handleLogin}>
                        <div className={styles.inputGroup}>
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                placeholder="tucorreo@ejemplo.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'Iniciando...' : 'Entrar'}
                        </button>
                        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                            ¿No tienes cuenta? <Link href="/registro" style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>Regístrate ahora</Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default function Login() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
