'use client';

import { useState, useEffect } from 'react';
import styles from '../Admin.module.css';

export default function AdminReservas() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'Todos',
        origin: 'Todos',
        destination: 'Todos'
    });

    const fetchBookings = async () => {
        setLoading(true);
        const query = new URLSearchParams(filters).toString();
        const res = await fetch(`/api/admin/bookings?${query}`);
        if (res.ok) {
            const data = await res.json();
            setBookings(data.bookings);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, [filters]);

    const handleStatusChange = async (id, newStatus) => {
        const res = await fetch('/api/admin/bookings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus })
        });
        if (res.ok) {
            fetchBookings();
        }
    };

    return (
        <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Gestión de Reservas</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select 
                        value={filters.status} 
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                        style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
                    >
                        <option value="Todos">Todos los Estados</option>
                        <option value="Confirmado">Confirmado</option>
                        <option value="Esperando pago">Esperando pago</option>
                        <option value="Cancelado">Cancelado</option>
                        <option value="Check-in completado">Check-in completado</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando reservas...</div>
            ) : (
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th>Referencia</th>
                            <th>Cliente</th>
                            <th>Vuelo</th>
                            <th>Ruta</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((b) => (
                            <tr key={b.id}>
                                <td><strong>{b.booking_reference}</strong></td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{b.passenger_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#666' }}>{b.user_email || 'Invitado'}</div>
                                </td>
                                <td>{b.flight_number}</td>
                                <td>{b.origin} → {b.destination}</td>
                                <td>{new Date(b.date).toLocaleDateString()}</td>
                                <td>
                                    <span className={`${styles.statusPill} ${
                                        b.status === 'Confirmado' || b.status === 'Check-in completado' ? styles.statusSuccess :
                                        b.status === 'Cancelado' ? styles.statusError :
                                        styles.statusPending
                                    }`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td>
                                    <select 
                                        value={b.status} 
                                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                                        style={{ fontSize: '0.8rem', padding: '4px' }}
                                    >
                                        <option value="Confirmado">Confirmar</option>
                                        <option value="Esperando pago">Pendiente</option>
                                        <option value="Cancelado">Cancelar</option>
                                        <option value="Check-in completado">Check-in OK</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {bookings.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No se encontraron reservas con los filtros seleccionados.</div>
            )}
        </div>
    );
}
