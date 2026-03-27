'use client';

import { useState, useEffect } from 'react';
import styles from '../Admin.module.css';

export default function AuditPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch('/api/admin/audit');
                if (res.ok) {
                    setLogs(await res.json());
                }
            } catch (err) {
                console.error('Error fetching logs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <p style={{ marginTop: '1rem', color: '#002d72' }}>Cargando registros de auditoría...</p>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3>Registros de Seguridad y Auditoría</h3>
                <button 
                    onClick={() => window.location.reload()} 
                    className={styles.statusPill} 
                    style={{ cursor: 'pointer', border: 'none', background: '#002d72', color: 'white' }}
                >
                    Actualizar
                </button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Usuario</th>
                            <th>Evento</th>
                            <th>Detalles</th>
                            <th>IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length > 0 ? logs.map(log => (
                            <tr key={log.id}>
                                <td style={{ whiteSpace: 'nowrap' }}>{new Date(log.created_at).toLocaleString()}</td>
                                <td>
                                    <strong>{log.user_name || 'Sistema'}</strong>
                                    <div style={{ fontSize: '0.75rem', color: '#666' }}>{log.user_email || 'N/A'}</div>
                                </td>
                                <td>
                                    <span className={`${styles.statusPill} ${
                                        log.event.toLowerCase().includes('error') || log.event.toLowerCase().includes('fail') ? styles.statusError : 
                                        log.event.toLowerCase().includes('login') ? styles.statusSuccess : styles.statusPending
                                    }`}>
                                        {log.event}
                                    </span>
                                </td>
                                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.detail}</td>
                                <td><code>{log.ip_address || 'Internal'}</code></td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>No hay registros disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
