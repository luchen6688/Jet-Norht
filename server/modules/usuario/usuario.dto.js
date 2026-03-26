export class UpdateUserDTO {
    constructor({ name, email }) {
        this.name = name?.trim();
        this.email = email?.toLowerCase().trim();
    }

    validate() {
        if (this.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email)) {
                throw new Error('Formato de correo electrónico inválido.');
            }
        }
        if (this.name && this.name.length < 2) {
            throw new Error('El nombre debe tener al menos 2 caracteres.');
        }
    }
}
