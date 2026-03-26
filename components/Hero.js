import styles from './Hero.module.css';
import FlightSearchBox from './FlightSearchBox';

export default function Hero() {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroOverlay}></div>
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>Reserva tu próxima escapada</h1>
                <p className={styles.heroSubtitle}>Servicio excepcional, más espacio, Wi-Fi gratis.</p>
                <FlightSearchBox />
            </div>
        </section>
    );
}
