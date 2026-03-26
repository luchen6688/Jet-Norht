import { NextResponse } from 'next/server';
import { authService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { buildAuthCookie, clearAuthCookie } from '@/lib/auth';

export const authController = {
    async login(request) {
        try {
            const body = await request.json();
            const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
            
            const dto = new LoginDTO(body);
            dto.validate();

            const { token, user } = await authService.login({
                email: dto.email,
                password: dto.password,
                ipAddress
            });

            const response = NextResponse.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                user
            });

            response.headers.set('Set-Cookie', buildAuthCookie(token));
            return response;
        } catch (error) {
            console.error('Login error:', error);
            const status = error.status || 400;
            return NextResponse.json({ error: error.message || 'Error al iniciar sesión.' }, { status });
        }
    },

    async register(request) {
        try {
            const body = await request.json();
            const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';

            const dto = new RegisterDTO(body);
            dto.validate();

            const { token, user } = await authService.register({
                name: dto.name,
                email: dto.email,
                password: dto.password,
                ipAddress
            });

            const response = NextResponse.json({
                success: true,
                message: 'Registro exitoso',
                user
            }, { status: 201 });

            response.headers.set('Set-Cookie', buildAuthCookie(token));
            return response;
        } catch (error) {
            console.error('Register error:', error);
            return NextResponse.json({ error: error.message || 'Error al registrarse.' }, { status: 400 });
        }
    },

    async logout(request) {
        try {
            const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
            const { getTokenFromRequest, verifyToken } = await import('@/lib/auth');
            const token = getTokenFromRequest(request);
            if (token) {
                const payload = await verifyToken(token);
                if (payload?.userId) {
                    authRepository.createAuditLog({
                        userId: payload.userId,
                        event: 'LOGOUT',
                        detail: 'Sesión cerrada',
                        ipAddress
                    });
                }
            }
        } catch (error) {
            console.error('Logout audit error:', error);
        }

        const response = NextResponse.json({ success: true, message: 'Sesión cerrada' });
        response.headers.set('Set-Cookie', clearAuthCookie());
        return response;
    },

    async getMe(userId) {
        try {
            const user = await authService.getMe(userId);
            return NextResponse.json({ user });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
    }
};
