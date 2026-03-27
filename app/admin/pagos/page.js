'use client';

import { useState, useEffect } from 'react';
import styles from '../Admin.module.css';

export default function AdminPagos() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/transactions');
        if (res.ok) {
            const data = await res.json();
            setTransactions(data.transactions);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const totalRevenue = transactions.reduce((acc, t) => acc + (t.status === 'completado' ? t.amount : 0), 0);

    return (
        <div>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>Ingresos Totales</div>
                    <div className={styles.statValue}>${totalRevenue.toLocaleString()}</div>
                    <div className={`${styles.statTrend} ${styles.trendUp}`}>Calculado sobre transacciones completadas</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>Transacciones</div>
                    <div className={styles.statValue}>{transactions.length}</div>
                    <div className={styles.statTrend}>Desde el inicio del periodo</div>
                </div>
            </div>

            <div className={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Panel de Transacciones</h3>
                    <button onClick={fetchTransactions} className={styles.logoutBtn} style={{ width: 'auto', backgroundColor: '#005eb8' }}>Actualizar</button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando transacciones...</div>
                ) : (
                    <table className={styles.adminTable}>
                        <thead>
                            <tr>
                                <th>Referencia</th>
                                <th>Reserva</th>
                                <th>Cliente</th>
                                <th>Monto</th>
                                <th>Método</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => (
                                <tr key={t.id}>
                                    <td><code style={{ fontSize: '0.8rem' }}>{t.provider_reference}</code></td>
                                    <td><strong>{t.booking_reference}</strong></td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{t.user_name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>{t.user_email}</div>
                                    </td>
                                    <td><strong>${t.amount}</strong></td>
                                    <td>{t.payment_method}</td>
                                    <td>
                                        <span className={`${styles.statusPill} ${t.status === 'completado' ? styles.statusSuccess : styles.statusPending}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td>{new Date(t.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {transactions.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No hay transacciones registradas.</div>
                )}
            </div>
        </div>
    );
}
