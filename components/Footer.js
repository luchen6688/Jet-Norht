'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

export default function Footer() {
    const pathname = usePathname();
    const [year, setYear] = useState(2026); // Default year for hydration matching

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <footer className={styles.footer}>
            <div className={styles.footerGrid}>
                <div className={styles.footerSection}>
                    <h4>Soporte al Cliente</h4>
                    <ul>
                        <li>Centro de Ayuda</li>
                        <li>Estado del Vuelo</li>
                        <li>Contáctanos: 1-800-NORTH-AIR</li>
                        <li>Chat en vivo (24/7)</li>
                        <li>soporte@northairways.com</li>
                    </ul>
                </div>
                <div className={styles.footerSection}>
                    <h4>Destinos e Inspiración</h4>
                    <ul>
                        <li>Guía de Viaje: Madrid</li>
                        <li>Explora el Caribe</li>
                        <li>Tips para Viajeros</li>
                        <li>Ofertas de Temporada</li>
                    </ul>
                </div>
                <div className={styles.footerSection}>
                    <h4>Sobre North Airways</h4>
                    <ul>
                        <li>Nuestra Flota</li>
                        <li>Sostenibilidad</li>
                        <li>Carreras</li>
                        <li>Inversionistas</li>
                    </ul>
                </div>
                <div className={styles.footerSection}>
                    <h4>Legal</h4>
                    <ul>
                        <li>Condiciones de Transporte</li>
                        <li>Privacidad</li>
                        <li>Cookies</li>
                        <li>Accesibilidad</li>
                    </ul>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <p>&copy; {year} North Airways. Todos los derechos reservados.</p>
                <div className={styles.paymentIcons}>
                    <span>💳 Tarjetas</span>
                    <span>📱 Billeteras Digitales</span>
                    <span>🏦 Transferencias</span>
                </div>
            </div>
        </footer>
    );
}
