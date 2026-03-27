'use client';

import { useState, useEffect } from 'react';
import styles from './Admin.module.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        revenue_today: 0,
        bookings_today: 0,
        active_flights: 0,
        system_alerts: 0,
        total_revenue: 0,
        total_bookings: 0,
        total_users: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [recentLogs, setRecentLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, bookingsRes, logsRes] = await Promise.all([
                    fetch('/api/admin/stats'),
                    fetch('/api/admin/bookings'),
                    fetch('/api/admin/audit')
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (bookingsRes.ok) {
                    const bookings = await bookingsRes.json();
                    setRecentBookings(bookings.slice(0, 5));
                }
                if (logsRes.ok) {
                    const logs = await logsRes.json();
                    setRecentLogs(logs.slice(0, 4));
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <p style={{ marginTop: '1rem', color: '#002d72' }}>Cargando panel operacional...</p>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>Ingresos Hoy</div>
                    <div className={styles.statValue}>${stats.revenue_today.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div className={`${styles.statTrend} ${styles.trendUp}`}>
                        <span>📈</span> Total: ${stats.total_revenue.toLocaleString()}
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>Nuevas Reservas</div>
                    <div className={styles.statValue}>{stats.bookings_today}</div>
                    <div className={`${styles.statTrend} ${styles.trendUp}`}>
                        <span>✨</span> Total: {stats.total_bookings}
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>Vuelos Activos</div>
                    <div className={styles.statValue}>{stats.active_flights}</div>
                    <div className={styles.statTrend}>
                        <span>🚀</span> Programados para hoy
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>Alertas de Sistema</div>
                    <div className={styles.statValue}>{stats.system_alerts}</div>
                    <div className={`${styles.statTrend} ${stats.system_alerts > 0 ? styles.trendDown : ''}`}>
                        <span>{stats.system_alerts > 0 ? '⚠️' : '✅'}</span>
                        {stats.system_alerts > 0 ? 'Revisión requerida' : 'Sistema saludable'}
                    </div>
                </div>
            </div>

            <div className={styles.recentGrid}>
                <div className={styles.card}>
                    <h3>
                        <span>Últimas Reservas</span>
                        <button style={{ fontSize: '0.75rem', padding: '6px 12px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Ver todas</button>
                    </h3>
                    <div className={styles.tableWrapper}>
                        <table className={styles.adminTable}>
                            <thead>
                                <tr>
                                    <th>Referencia</th>
                                    <th>Pasajero</th>
                                    <th>Ruta</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.length > 0 ? recentBookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td><strong>{booking.booking_reference}</strong></td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{booking.passenger_name}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.85rem' }}>{booking.origin} → {booking.destination}</div>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusPill} ${
                                                booking.status === 'Confirmado' || booking.status === 'Completado' ? styles.statusSuccess : 
                                                booking.status === 'Cancelado' ? styles.statusError : styles.statusPending
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No hay reservas recientes</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3>Actividad Reciente</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                        {recentLogs.length > 0 ? recentLogs.map(log => (
                            <div key={log.id} style={{ borderLeft: `3px solid ${log.event.toLowerCase().includes('error') || log.event.toLowerCase().includes('fail') ? 'var(--error)' : 'var(--primary)'}`, paddingLeft: '1rem', position: 'relative' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                    {new Date(log.created_at).toLocaleString()}
                                </div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                    {log.user_name || 'System'}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{log.event}: {log.detail}</div>
                            </div>
                        )) : (
                            <div style={{ padding: '1rem', color: '#666', textAlign: 'center' }}>No hay actividad reciente</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
