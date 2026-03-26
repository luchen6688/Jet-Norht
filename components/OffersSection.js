import styles from './OffersSection.module.css';

const offers = [
    { id: 1, title: 'Descubre Haití', price: '$89', image: '/haiti_offer.png' },
    { id: 2, title: 'Lo mejor de España', price: '$450', image: '/madrid_offer.png' },
    { id: 3, title: 'Escapada a Cancún', price: '$199', image: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&q=80&w=400&h=300' },
];

export default function OffersSection() {
    return (
        <section className={styles.offersSection}>
            <h2 className={styles.sectionTitle}>Ofertas Destacadas</h2>
            <div className={styles.offersGrid}>
                {offers.map(offer => (
                    <div key={offer.id} className={styles.offerCard}>
                        <div className={styles.imageWrapper}>
                            <img src={offer.image} alt={offer.title} />
                        </div>
                        <div className={styles.cardContent}>
                            <h3>{offer.title}</h3>
                            <p>Tarifas desde <strong className={styles.price}>{offer.price}</strong> solo ida</p>
                            <button className={styles.bookBtn}>Reservar ahora</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
