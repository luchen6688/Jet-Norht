'use client';

import Navbar from '@/components/Navbar';
import styles from '../shared.module.css';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Registro() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // La cookie JWT se guarda automáticamente — no se usa localStorage
            router.push('/');
            router.refresh(); // Actualiza el Navbar
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
                <h1 className={styles.title}>Únete a North Airways</h1>
                <p className={styles.subtitle}>Crea una cuenta para reservar más rápido y disfrutar de beneficios exclusivos.</p>
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
                    <form className={styles.authForm} onSubmit={handleRegister}>
                        <div className={styles.inputGroup}>
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                placeholder="Ej: Juan Pérez"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                minLength={2}
                                autoComplete="name"
                            />
                        </div>
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
                            <label>Contraseña <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>(mín. 8 caracteres)</span></label>
                            <input
                                type="password"
                                placeholder="Crea una contraseña segura"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={8}
                                autoComplete="new-password"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Confirmar Contraseña</label>
                            <input
                                type="password"
                                placeholder="Repite tu contraseña"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </button>
                        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                            ¿Ya tienes cuenta? <Link href="/login" style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>Inicia Sesión</Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
