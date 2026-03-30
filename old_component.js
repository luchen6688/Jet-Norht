'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './FlightSearchBox.module.css';

export default function FlightSearchBox() {
    const [tripType, setTripType] = useState('Roundtrip');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [airports, setAirports] = useState([]);
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [bookingFlightId, setBookingFlightId] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/airports', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => setAirports(data.airports || []));
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!origin || !destination || !date) return;
        setIsLoading(true);
        const res = await fetch(`/api/flights?origin=${origin}&destination=${destination}&date=${date}`);
        const data = await res.json();
        setResults(data.flights);
        setIsLoading(false);
    };

    const handleSelectFlight = async (flightId) => {
        setBookingFlightId(flightId);
        
        try {
            // Check session first
            const meRes = await fetch('/api/auth/me');
            if (!meRes.ok) {
                router.push(`/login?redirect=/reservar`);
                return;
            }
            const userData = await meRes.json();
            const passengerName = userData.user.name;
            
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ flightId, passengerName })
            });

            const data = await res.json();
            if (res.ok) {
                setBookingSuccess(data.booking.bookingReference); // Real reference from backend
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            alert('Error al procesar la reserva: ' + err.message);
        } finally {
            setBookingFlightId(null);
        }
    };

    return (
        <div className={styles.searchContainer}>
            <div className={styles.tripTypes}>
                {['Ida y vuelta', 'Solo ida', 'Multidestino'].map(type => (
                    <button
                        key={type}
                        type="button"
                        className={`${styles.typeBtn} ${tripType === type ? styles.activeType : ''}`}
                        onClick={() => setTripType(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <form className={styles.searchForm} onSubmit={handleSearch}>
                <div className={styles.inputGroup}>
                    <label>Origen</label>
                    <select value={origin} onChange={(e) => setOrigin(e.target.value)} required>
                        <option value="" disabled>Selecciona origen</option>
                        {airports.map(a => <option key={a.code} value={a.code}>{a.city} ({a.code})</option>)}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label>Destino</label>
                    <select value={destination} onChange={(e) => setDestination(e.target.value)} required>
                        <option value="" disabled>Selecciona destino</option>
                        {airports.map(a => <option key={a.code} value={a.code}>{a.city} ({a.code})</option>)}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label>Salida</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>

                {tripType === 'Ida y vuelta' && (
                    <div className={styles.inputGroup}>
                        <label>Regreso</label>
                        <input type="date" required />
                    </div>
                )}

                <div className={styles.inputGroup}>
                    <label>Pasajeros</label>
                    <select defaultValue="1">
                        {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>{num} Adulto{num > 1 ? 's' : ''}</option>)}
                    </select>
                </div>

                <button type="submit" className={styles.searchBtn}>
                    {isLoading ? 'Buscando...' : 'Buscar vuelos'}
                </button>
            </form>

            {results !== null && (
                <div className={styles.resultsContainer}>
                    <div className={styles.resultsHeader}>
                        <h3>Resultados de vuelo</h3>
                        <button className={styles.closeBtn} onClick={() => setResults(null)}>├ù</button>
                    </div>
                    {isLoading ? (
                        <ul className={styles.flightList}>
                            {[1, 2, 3].map(i => (
                                <li key={i} className={styles.flightItem} style={{ opacity: 0.6 }}>
                                    <div className={styles.flightInfo} style={{ width: '60%' }}>
                                        <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '80%' }}></div>
                                        <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '50%' }}></div>
                                    </div>
                                    <div className={styles.flightAction}>
                                        <div className={`${styles.skeleton} ${styles.skeletonPrice}`}></div>
                                        <div className={`${styles.skeleton} ${styles.skeletonBtn}`} style={{ marginTop: '0.5rem' }}></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : results.length > 0 ? (
                        <ul className={styles.flightList}>
                            {results.map(f => (
                                <li key={f.id} className={styles.flightItem}>
                                    <div className={styles.flightInfo}>
                                        <div className={styles.flightTime}>{f.date} | {f.scheduled_departure_time} - {f.scheduled_arrival_time}</div>
                                        <div className={styles.flightRoute}>{f.origin} a {f.destination} ({f.flight_number})</div>
                                    </div>
                                    <div className={styles.flightAction}>
                                        <div className={styles.flightPrice}>${f.price}</div>
                                        <button
                                            className={styles.selectBtn}
                                            onClick={() => handleSelectFlight(f.id)}
                                            disabled={bookingFlightId === f.id}
                                        >
                                            {bookingFlightId === f.id ? 'Reservando...' : 'Seleccionar'}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.noResults}>No se encontraron vuelos para esta ruta.</p>
                    )}
                </div>
            )}

            {/* Success Modal */}
            {bookingSuccess && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalIcon}>
                            Ô£ô
                        </div>
                        <h2 className={styles.modalTitle}>┬íReserva Creada!</h2>
                        <p className={styles.modalText}>
                            Tu reserva ha sido generada exitosamente, pendiente de pago. Aqu├¡ tienes tu c├│digo:
                        </p>
                        <div className={styles.referenceCode}>
                            {bookingSuccess}
                        </div>
                        <button 
                            className={styles.modalBtn}
                            onClick={() => {
                                setBookingSuccess(null);
                                router.push('/mis-viajes');
                            }}
                        >
                            Ir a Mis Viajes para Pagar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
