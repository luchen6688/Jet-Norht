import Navbar from '@/components/Navbar';
import styles from '../shared.module.css';

export default function Info() {
    return (
        <main className={styles.pageContainer}>
            <Navbar />
            <div className={styles.heroHeader}>
                <h1 className={styles.title}>Información de Viaje</h1>
                <p className={styles.subtitle}>Todo lo que necesitas saber antes de despegar con North Airways.</p>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.contentCard}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--primary-blue)' }}>Equipaje</h3>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
                        Conoce nuestra política de equipaje de mano y tarifas de equipaje facturado. Un artículo personal gratis en todas las tarifas.
                    </p>

                    <h3 style={{ marginBottom: '1rem', color: 'var(--primary-blue)' }}>Requisitos de Viaje</h3>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
                        Asegúrate de tener la documentación adecuada, incluyendo pasaportes y visas para destinos internacionales.
                    </p>

                    <h3 style={{ marginBottom: '1rem', color: 'var(--primary-blue)' }}>Experiencia a Bordo</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Disfruta de Wi-Fi gratuito de alta velocidad, snacks de cortesía y la mayor cantidad de espacio para las piernas en clase económica.
                    </p>
                </div>
            </div>
        </main>
    );
}
