import './globals.css';

export const metadata = {
    title: 'North Airways',
    description: 'Reserva tus vuelos premium',
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body>
                {children}
            </body>
        </html>
    );
}
