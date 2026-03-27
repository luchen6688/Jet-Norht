'use client';

import { useState, useEffect } from 'react';
import styles from '../Admin.module.css';

export default function AdminVuelos() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ price: '', gate: '' });

    const fetchFlights = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/flights');
        if (res.ok) {
            const data = await res.json();
            setFlights(data.flights);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFlights();
    }, []);

    const handleEdit = (flight) => {
        setEditingId(flight.id);
        setEditForm({ price: flight.price, gate: flight.gate || '' });
    };

    const handleSave = async (id) => {
        const res = await fetch('/api/admin/flights', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...editForm })
        });
        if (res.ok) {
            setEditingId(null);
            fetchFlights();
        }
    };

    return (
        <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Gestión de Operaciones: Vuelos</h3>
                <button onClick={fetchFlights} className={styles.logoutBtn} style={{ width: 'auto', backgroundColor: '#005eb8' }}>Actualizar</button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando vuelos...</div>
            ) : (
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th>Vuelo</th>
                            <th>Ruta</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Precio</th>
                            <th>Puerta</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map((f) => (
                            <tr key={f.id}>
                                <td><strong>{f.flight_number}</strong></td>
                                <td>{f.origin_city} ({f.origin}) → {f.destination_city} ({f.destination})</td>
                                <td>{new Date(f.date).toLocaleDateString()}</td>
                                <td>{f.scheduled_departure_time} - {f.scheduled_arrival_time}</td>
                                <td>
                                    {editingId === f.id ? (
                                        <input 
                                            type="number" 
                                            value={editForm.price} 
                                            onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                                            style={{ width: '80px', padding: '4px' }}
                                        />
                                    ) : (
                                        `$${f.price}`
                                    )}
                                </td>
                                <td>
                                    {editingId === f.id ? (
                                        <input 
                                            type="text" 
                                            value={editForm.gate} 
                                            onChange={(e) => setEditForm({...editForm, gate: e.target.value})}
                                            style={{ width: '60px', padding: '4px' }}
                                        />
                                    ) : (
                                        f.gate || '---'
                                    )}
                                </td>
                                <td>
                                    {editingId === f.id ? (
                                        <button onClick={() => handleSave(f.id)} style={{ color: '#2e7d32', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Guardar</button>
                                    ) : (
                                        <button onClick={() => handleEdit(f)} style={{ color: '#005eb8', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Editar</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
