'use client';

import Navbar from '@/components/Navbar';
import styles from '../shared.module.css';
import { useState } from 'react';

export default function CheckIn() {
    const [reference, setReference] = useState('');
    const [lastName, setLastName] = useState('');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checkedIn, setCheckedIn] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/bookings?reference=${reference}&lastName=${lastName}`);
            const data = await res.json();
            if (res.ok && data.bookings?.length > 0) {
                const b = data.bookings[0];
                setBooking(b);
                if (b.status === 'Check-in completado') {
                    setCheckedIn(true);
                }
            } else {
                alert(data.error || 'No se encontró la reserva. Verifica los datos.');
            }
        } catch (err) {
            alert('Error al buscar la reserva.');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/bookings/${booking.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'checkin' })
            });
            const data = await res.json();
            if (res.ok) {
                alert('¡Check-in realizado con éxito!');
                setCheckedIn(true);
                // Refresh booking data
                const res2 = await fetch(`/api/bookings/${booking.id}`);
                const data2 = await res2.json();
                setBooking(data2.booking);
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('Error al realizar el check-in.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.pageContainer}>
            <Navbar />
            <div className={styles.heroHeader}>
                <h1 className={styles.title}>Check-In Online</h1>
                <p className={styles.subtitle}>Ahorra tiempo en el aeropuerto. Haz check-in hasta 24 horas antes de tu vuelo.</p>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.contentCard} style={{ maxWidth: '700px' }}>
                    
                    {!booking && (
                        <form className={styles.authForm} onSubmit={handleSearch}>
                            <div className={styles.inputGroup}>
                                <label>Código de confirmación</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej: ABCDEF" 
                                    value={reference} 
                                    onChange={e => setReference(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Apellido del pasajero</label>
                                <input 
                                    type="text" 
                                    placeholder="Tu apellido" 
                                    value={lastName} 
                                    onChange={e => setLastName(e.target.value)} 
                                    required 
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn} disabled={loading}>
                                {loading ? 'Buscando...' : 'Continuar a Check-In'}
                            </button>
                        </form>
                    )}

                    {booking && !checkedIn && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ padding: '2rem', borderRadius: '12px', background: '#f8f9fa', marginBottom: '2rem' }}>
                                <h3 style={{ color: 'var(--primary-blue)', marginBottom: '1rem' }}>Detalles del Vuelo</h3>
                                <p><strong>Pasajero:</strong> {booking.passenger_name}</p>
                                <p><strong>Ruta:</strong> {booking.origin_city} ➔ {booking.destination_city}</p>
                                <p><strong>Fecha/Hora:</strong> {booking.date} | {booking.scheduled_departure_time}</p>
                                <p><strong>Estado:</strong> {booking.status}</p>
                            </div>
                            
                            {booking.status === 'Cancelado' ? (
                                <p style={{ color: '#c62828', fontWeight: 'bold' }}>Esta reserva ha sido cancelada.</p>
                            ) : booking.status === 'Esperando pago' ? (
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ color: '#ef6c00', marginBottom: '1rem', fontWeight: '500' }}>
                                        Debes pagar tu reserva antes de realizar el check-in.
                                    </p>
                                    <button 
                                        onClick={() => window.location.href = '/mis-viajes'} 
                                        className={styles.submitBtn}
                                        style={{ backgroundColor: 'var(--secondary-blue)', display: 'inline-block', padding: '0.8rem 2rem' }}
                                    >
                                        Ir a Pagar
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={handleCheckIn} 
                                    className={styles.submitBtn} 
                                    disabled={loading}
                                    style={{ 
                                        backgroundColor: 'var(--accent-teal)', 
                                        borderColor: 'var(--accent-teal)',
                                        display: 'inline-block',
                                        padding: '0.8rem 2rem'
                                    }}
                                >
                                    {loading ? 'Procesando...' : 'Confirmar Check-In Ahora'}
                                </button>
                            )}
                            
                            <button 
                                onClick={() => setBooking(null)} 
                                style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Buscar otra reserva
                            </button>
                        </div>
                    )}

                    {booking && checkedIn && (
                        <div>
                            <div style={{ 
                                border: '2px dashed var(--primary-blue)', 
                                padding: '2rem', 
                                borderRadius: '15px', 
                                background: 'white',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ 
                                    backgroundColor: 'var(--primary-blue)', 
                                    color: 'white', 
                                    padding: '0.5rem', 
                                    margin: '-2rem -2rem 1.5rem -2rem',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase'
                                }}>
                                    Pase de Abordar (Simulado)
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: '#888' }}>PASAJERO</div>
                                        <div style={{ fontWeight: 'bold' }}>{booking.passenger_name.toUpperCase()}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#888' }}>VUELO</div>
                                        <div style={{ fontWeight: 'bold' }}>NA-{booking.id + 100}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-blue)' }}>{booking.origin}</div>
                                        <div style={{ fontSize: '0.8rem' }}>{booking.origin_city}</div>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'center', color: '#ccc' }}>✈</div>
                                    <div style={{ flex: 1, textAlign: 'right' }}>
                                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-blue)' }}>{booking.destination}</div>
                                        <div style={{ fontSize: '0.8rem' }}>{booking.destination_city}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: '#888' }}>FECHA</div>
                                        <div style={{ fontWeight: 'bold' }}>{booking.date}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: '#888' }}>PUERTA</div>
                                        <div style={{ fontWeight: 'bold' }}>{booking.gate || 'B4'}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#888' }}>ASIENTO</div>
                                        <div style={{ fontWeight: 'bold' }}>{booking.seat_number || '---'}</div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                    <div style={{ 
                                        height: '60px', 
                                        background: 'repeating-linear-gradient(90deg, #000 0 2px, transparent 2px 4px)',
                                        width: '80%',
                                        margin: '0 auto'
                                    }}></div>
                                    <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#888' }}>{booking.booking_reference}</div>
                                </div>
                            </div>
                            
                            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                <p style={{ color: 'var(--accent-teal)', fontWeight: 'bold', marginBottom: '1rem' }}>✓ Check-in completado exitosamente</p>
                                <button onClick={() => window.print()} className={styles.submitBtn} style={{ maxWidth: '200px' }}>Imprimir Pase</button>
                                <button 
                                    onClick={() => { setBooking(null); setCheckedIn(false); }} 
                                    style={{ display: 'block', margin: '1rem auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                >
                                    Realizar otro check-in
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </main>
    );
}
