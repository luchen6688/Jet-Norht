import { AuthProvider } from '@/lib/AuthContext';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
    title: 'North Airways',
    description: 'Reserva tus vuelos premium',
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body suppressHydrationWarning>
                <AuthProvider>
                    <Navbar />
                    {children}
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
