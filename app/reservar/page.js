import Navbar from '@/components/Navbar';
import styles from '../shared.module.css';
import FlightSearchBox from '@/components/FlightSearchBox';

export default function Reservar() {
    return (
        <main className={styles.pageContainer}>
            <Navbar />
            <div className={styles.heroHeader}>
                <h1 className={styles.title}>Reservar un vuelo</h1>
                <p className={styles.subtitle}>Encuentra las mejores tarifas a más de 100 destinos con North Airways.</p>
            </div>
            <div className={styles.contentContainer}>
                <FlightSearchBox />
            </div>
        </main>
    );
}
