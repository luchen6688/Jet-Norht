'use client';

import { useAuth } from '@/lib/AuthContext';
import styles from './AuthPromptModal.module.css';
import { useRouter } from 'next/navigation';

export default function AuthPromptModal() {
    const { isPromptOpen, closePrompt } = useAuth();
    const router = useRouter();

    if (!isPromptOpen) return null;

    const handleAction = (path) => {
        closePrompt();
        router.push(path);
    };

    return (
        <div className={styles.modalOverlay} onClick={closePrompt}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeX} onClick={closePrompt}>✕</button>
                <div className={styles.iconWrapper}>✈️</div>
                <h2>Inicia sesión para continuar</h2>
                <p>Para realizar una reserva o acceder a funciones exclusivas, por favor inicia sesión o crea una cuenta en North Airways.</p>
                
                <div className={styles.buttonGroup}>
                    <button 
                        className={styles.loginBtn} 
                        onClick={() => handleAction('/login')}
                    >
                        Iniciar Sesión
                    </button>
                    <button 
                        className={styles.registerBtn} 
                        onClick={() => handleAction('/registro')}
                    >
                        Registrarse
                    </button>
                </div>
            </div>
        </div>
    );
}
