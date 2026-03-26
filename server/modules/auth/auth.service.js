import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { authRepository } from './auth.repository';
import { InvalidCredentialsError, AccountDisabledError } from './auth.errors';

export const authService = {
    async login({ email, password, ipAddress }) {
        const user = authRepository.findUserByEmail(email);

        if (!user) {
            authRepository.createAuditLog({
                event: 'LOGIN_FAILED',
                detail: `Email no encontrado: ${email}`,
                ipAddress
            });
            throw new InvalidCredentialsError();
        }

        if (!user.is_active) {
            throw new AccountDisabledError();
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            authRepository.createAuditLog({
                userId: user.id,
                event: 'LOGIN_FAILED',
                detail: 'Contraseña incorrecta',
                ipAddress
            });
            throw new InvalidCredentialsError();
        }

        authRepository.createAuditLog({
            userId: user.id,
            event: 'LOGIN',
            detail: 'Inicio de sesión exitoso',
            ipAddress
        });

        const token = await signToken({
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        };
    },

    async register({ name, email, password, ipAddress }) {
        const existingUser = authRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error('El correo electrónico ya está registrado.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = authRepository.createUser({ name, email, password: hashedPassword });

        authRepository.createAuditLog({
            userId: userId,
            event: 'REGISTER',
            detail: 'Registro de usuario exitoso',
            ipAddress
        });

        const user = authRepository.findUserById(userId);
        const token = await signToken({
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        });

        return { token, user };
    },

    async getMe(userId) {
        const user = authRepository.findUserById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado.');
        }
        return user;
    }
};
