'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import styles from './OffersSection.module.css';

const offers = [
    { id: 1, title: 'Descubre Haití', price: '$89', image: '/haiti_offer.png', origin: 'SDQ', destination: 'PAP' },
    { id: 2, title: 'Lo mejor de España', price: '$450', image: '/madrid_offer.png', origin: 'SDQ', destination: 'MAD' },
    { id: 3, title: 'Escapada a Cancún', price: '$199', image: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&q=80&w=400&h=300', origin: 'MIA', destination: 'CUN' },
];

export default function OffersSection() {
    const router = useRouter();
    const { user, openPrompt } = useAuth();

    const handleBook = (origin, destination) => {
        if (!user) {
            openPrompt();
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        router.push(`/?origin=${origin}&destination=${destination}&date=${today}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className={styles.offersSection}>
            <h2 className={styles.sectionTitle}>Ofertas Destacadas</h2>
            <div className={styles.offersGrid}>
                {offers.map(offer => (
                    <div key={offer.id} className={styles.offerCard} onClick={() => handleBook(offer.origin, offer.destination)}>
                        <div className={styles.imageWrapper}>
                            <img src={offer.image} alt={offer.title} />
                        </div>
                        <div className={styles.cardContent}>
                            <h3>{offer.title}</h3>
                            <p>Tarifas desde <strong className={styles.price}>{offer.price}</strong> solo ida</p>
                            <div className={styles.cardActions}>
                                <button className={styles.bookBtn} onClick={(e) => {
                                    e.stopPropagation();
                                    handleBook(offer.origin, offer.destination);
                                }}>Reservar ahora</button>
                                <a href="#" className={styles.guideLink} onClick={(e) => e.preventDefault()}>Ver guía de viaje</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
