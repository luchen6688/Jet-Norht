'use client';

import Navbar from '@/components/Navbar';
import styles from '../shared.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MisViajes() {
    const [reference, setReference] = useState('');
    const [lastName, setLastName] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [user, setUser] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isPaying, setIsPaying] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [view, setView] = useState('bookings'); // bookings, profile, activity
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    fetchUserBookings();
                }
            } catch (err) {
                console.error("Session check failed", err);
            }
        };
        checkSession();
    }, []);

    const fetchUserBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/bookings`);
            const data = await res.json();
            if (res.ok) {
                setBookings(data.bookings || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setSearched(true);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!reference || !lastName) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/bookings?reference=${reference}&lastName=${lastName}`);
            const data = await res.json();
            if (res.ok) {
                setBookings(data.bookings || []);
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('Error buscando viaje.');
        } finally {
            setLoading(false);
            setSearched(true);
        }
    };

    const handleAction = async (bookingId, action) => {
        if (action === 'cancel' && !confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;
        
        if (action === 'pay') {
            setSelectedBooking(bookings.find(b => b.id === bookingId));
            setPaymentSuccess(false);
            setShowPaymentModal(true);
            return;
        }

        executeAction(bookingId, action);
    };

    const executeAction = async (bookingId, action) => {
        try {
            // Simulate 1.5s gateway delay for realism if paying
            if (action === 'pay') {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            const data = await res.json();
            if (res.ok) {
                // Refresh list
                await fetchUserBookings();
                
                if (action === 'checkin') {
                    alert('¡Check-in realizado con éxito! Te redirigiremos a tu pase de abordar.');
                    router.push('/check-in'); 
                } else if (action === 'pay') {
                    setPaymentSuccess(true);
                    // The user can manually close it, or we auto-close after 3 seconds
                    setTimeout(() => {
                        setShowPaymentModal(false);
                        setPaymentSuccess(false);
                    }, 4000);
                } else {
                    alert(data.message);
                }
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('Ocurrió un error al procesar la solicitud.');
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <main className={styles.pageContainer}>
            <Navbar />
            <div className={styles.heroHeader}>
                <h1 className={styles.title}>Mis Viajes</h1>
                <p className={styles.subtitle}>Gestiona tus reservas, cambia asientos o añade equipaje.</p>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.contentCard} style={{ maxWidth: '950px' }}>

                    {!user && !searched && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>Busca tu reserva</h3>
                            <form className={styles.authForm} onSubmit={handleSearch}>
                                <div className={styles.inputGroup}>
                                    <label>Código de confirmación</label>
                                    <input type="text" placeholder="Ej: ABCDEF" value={reference} onChange={e => setReference(e.target.value)} required />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Apellido del pasajero</label>
                                    <input type="text" placeholder="Tu apellido" value={lastName} onChange={e => setLastName(e.target.value)} required />
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={loading}>
                                    {loading ? 'Buscando...' : 'Buscar Viaje'}
                                </button>
                            </form>
                        </div>
                    )}

                    {user && (
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>Hola, {user.name}</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Aquí están tus próximos viajes con North Airways.</p>
                        </div>
                    )}

                    {user && (
                        <nav className={styles.tabContainer}>
                            <button onClick={() => setView('bookings')} className={`${styles.tabBtn} ${view === 'bookings' ? styles.tabBtnActive : ''}`}>Mis Reservas</button>
                            <button onClick={() => setView('profile')} className={`${styles.tabBtn} ${view === 'profile' ? styles.tabBtnActive : ''}`}>Mi Perfil</button>
                            <button onClick={() => setView('activity')} className={`${styles.tabBtn} ${view === 'activity' ? styles.tabBtnActive : ''}`}>Actividad</button>
                        </nav>
                    )}

                    {view === 'bookings' && (searched || user) && (
                        <div>
                            {bookings.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    {bookings.map(b => (
                                        <div key={b.id} className={styles.bookingCard}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.25rem' }}>
                                                        CONFIRMACIÓN
                                                    </div>
                                                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary-blue)', lineHeight: 1 }}>
                                                        {b.booking_reference}
                                                    </div>
                                                </div>
                                                <div className={`${styles.statusBadge} ${
                                                    b.status === 'Cancelado' ? styles.statusCancelled : 
                                                    b.status === 'Confirmado' || b.status === 'Check-in completado' ? styles.statusConfirmed : 
                                                    styles.statusPending
                                                }`}>
                                                    {b.status}
                                                </div>
                                            </div>

                                            <div className={styles.bookingGrid}>
                                                <div>
                                                    <div style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                                                        <strong>{b.passenger_name}</strong>
                                                    </div>
                                                    <div className={styles.routeInfo}>
                                                        <strong>{b.origin_city}</strong> <span style={{ color: 'var(--accent-cyan)' }}>➔</span> <strong>{b.destination_city}</strong>
                                                    </div>
                                                    <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>
                                                        {b.date} | {b.scheduled_departure_time} - {b.scheduled_arrival_time} | Vuelo {b.flight_number}
                                                    </div>
                                                </div>
                                                <div className={styles.priceTag}>
                                                    ${b.price}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                                {b.status === 'Esperando pago' && (
                                                    <button 
                                                        onClick={() => handleAction(b.id, 'pay')}
                                                        className={styles.submitBtn} 
                                                        style={{ flex: 1, margin: 0 }}
                                                    >
                                                        Pagar ahora
                                                    </button>
                                                )}
                                                {(b.status === 'Confirmado' || b.status === 'Esperando pago') && (
                                                    <button 
                                                        onClick={() => handleAction(b.id, 'checkin')}
                                                        className={styles.submitBtn} 
                                                        style={{ 
                                                            flex: 1, 
                                                            margin: 0, 
                                                            backgroundColor: 'var(--accent-teal)', 
                                                            borderColor: 'var(--accent-teal)' 
                                                        }}
                                                    >
                                                        Check-In
                                                    </button>
                                                )}
                                                {b.status !== 'Cancelado' && (
                                                    <button 
                                                        onClick={() => handleAction(b.id, 'cancel')}
                                                        className={styles.submitBtn} 
                                                        style={{ 
                                                            flex: 1, 
                                                            margin: 0, 
                                                            backgroundColor: 'transparent', 
                                                            border: '1px solid #c62828', 
                                                            color: '#c62828' 
                                                        }}
                                                    >
                                                        Cancelar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✈️</div>
                                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                        No tienes viajes programados todavía.
                                    </p>
                                    {!user && (
                                        <button onClick={() => setSearched(false)} className={styles.submitBtn} style={{ maxWidth: '250px', margin: '0 auto' }}>
                                            Nueva búsqueda
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {view === 'profile' && user && (
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--primary-blue)', marginBottom: '1.5rem' }}>Tu Perfil</h3>
                            <UserProfile user={user} onUpdate={(updatedUser) => setUser(updatedUser)} />
                        </div>
                    )}

                    {view === 'activity' && user && (
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--primary-blue)', marginBottom: '1.5rem' }}>Actividad Reciente</h3>
                            <AuditHistory userId={user.id} />
                        </div>
                    )}

                </div>
            </div>

            {showPaymentModal && selectedBooking && (
                <div className={styles.modalOverlay}>
                    <div className={styles.paymentModalContent}>
                        {!paymentSuccess ? (
                            <>
                                <button 
                                    className={styles.closePaymentBtn} 
                                    onClick={() => setShowPaymentModal(false)}
                                >
                                    ×
                                </button>
                                <h2 className={styles.paymentTitle}>Finalizar Pago</h2>
                                
                                <div className={styles.paymentSummary}>
                                    <div className={styles.summaryRow}>
                                        <span className={styles.summaryLabel}>Reserva:</span>
                                        <span className={styles.summaryValue}>{selectedBooking.booking_reference}</span>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <span className={styles.summaryLabel}>Total a pagar:</span>
                                        <span className={styles.summaryPrice}>${selectedBooking.price}</span>
                                    </div>
                                </div>

                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    setIsPaying(true);
                                    executeAction(selectedBooking.id, 'pay');
                                }}>
                                    <div className={styles.paymentInputs}>
                                        <input 
                                            type="text" 
                                            className={`${styles.paymentInput} ${styles.fullWidth}`} 
                                            placeholder="Número de tarjeta" 
                                            defaultValue="4242 4242 4242 4242"
                                            required 
                                        />
                                        <input 
                                            type="text" 
                                            className={`${styles.paymentInput} ${styles.halfWidth}`} 
                                            placeholder="MM/AA" 
                                            defaultValue="12/26"
                                            required 
                                        />
                                        <input 
                                            type="text" 
                                            className={`${styles.paymentInput} ${styles.halfWidth}`} 
                                            placeholder="CVV" 
                                            defaultValue="123"
                                            required 
                                        />
                                    </div>
                                    
                                    <button type="submit" className={styles.paymentSubmitBtn} disabled={isPaying}>
                                        {isPaying ? 'Procesando Pago...' : `Pagar $${selectedBooking.price}`}
                                    </button>
                                </form>
                                <p className={styles.paymentFooter}>Pago seguro encriptado con SSL de 256 bits.</p>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <div style={{ 
                                    width: '80px', height: '80px', background: 'rgba(46, 125, 50, 0.15)', 
                                    color: '#2e7d32', borderRadius: '50%', display: 'flex', 
                                    alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', 
                                    fontSize: '40px', animation: 'fadeIn 0.5s ease-out' 
                                }}>
                                    ✓
                                </div>
                                <h2 className={styles.paymentTitle} style={{ color: '#2e7d32' }}>¡Pago Completado!</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                                    El pago de tu reserva <strong>{selectedBooking.booking_reference}</strong> ha sido exitoso.
                                </p>
                                <button 
                                    className={styles.paymentSubmitBtn} 
                                    style={{ backgroundColor: '#2e7d32' }}
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setPaymentSuccess(false);
                                    }}
                                >
                                    Ver mi boleto
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}

function AuditHistory({ userId }) {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch(`/api/audit?userId=${userId}`);
                const data = await res.json();
                if (res.ok) {
                    setLogs(data.logs || []);
                }
            } catch (err) {
                console.error("Audit fetch failed", err);
            }
        };
        fetchLogs();
    }, [userId]);

    if (logs.length === 0) return <p style={{ fontSize: '0.85rem', color: '#999' }}>No hay actividad reciente.</p>;

    return (
        <div style={{ fontSize: '0.85rem' }}>
            {logs.map(log => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: 'var(--text-dark)' }}>
                        <strong>{log.event}:</strong> {log.detail}
                    </span>
                    <span style={{ color: '#999' }}>{new Date(log.created_at).toLocaleString()}</span>
                </div>
            ))}
        </div>
    );
}

function UserProfile({ user, onUpdate }) {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const res = await fetch('/api/usuario', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Perfil actualizado con éxito');
                onUpdate(data.user);
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('Error al actualizar el perfil');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>Nombre</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} required />
            </div>
            <button type="submit" disabled={isUpdating} className={styles.submitBtn} style={{ marginTop: '1rem' }}>
                {isUpdating ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
        </form>
    );
}
