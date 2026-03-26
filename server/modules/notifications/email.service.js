import nodemailer from 'nodemailer';

export const emailService = {
    transporter: null,

    async init() {
        if (this.transporter) return;

        // Use Ethereal Email for testing (creates a fake SMTP service on the fly)
        const testAccount = await nodemailer.createTestAccount();

        this.transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
        console.log('Ethereal Email initialized for testing.');
    },

    async sendBookingConfirmation(email, bookingDetails) {
        await this.init();

        const mailOptions = {
            from: '"North Airways" <no-reply@northairways.com>',
            to: email,
            subject: `Confirmación de Reserva - ${bookingDetails.bookingReference}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #0d47a1;">¡Reserva Confirmada!</h2>
                    <p>Hola <strong>${bookingDetails.passengerName}</strong>,</p>
                    <p>Tu reserva con North Airways ha sido procesada con éxito. Aquí tienes los detalles:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Código de Reserva:</strong> <span style="font-size: 1.2em; color: #0d47a1;">${bookingDetails.bookingReference}</span></p>
                        <p><strong>Vuelo:</strong> ${bookingDetails.flightNumber}</p>
                        <p><strong>Ruta:</strong> ${bookingDetails.origin} ➔ ${bookingDetails.destination}</p>
                        <p><strong>Fecha y Hora de Salida:</strong> ${bookingDetails.date} a las ${bookingDetails.departureTime}</p>
                        <p><strong>Estado:</strong> ${bookingDetails.status}</p>
                    </div>
                    <p>Recuerda que puedes hacer check-in desde 24 horas antes de la salida de tu vuelo.</p>
                    <p>¡Gracias por elegir North Airways!</p>
                </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Mensaje enviado: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('URL de vista previa del correo: %s', nodemailer.getTestMessageUrl(info));
            return info;
        } catch (error) {
            console.error('Error enviando correo:', error);
            throw error;
        }
    }
};
