import { NextResponse } from 'next/server';
import { userService } from './usuario.service';
import { UpdateUserDTO } from './usuario.dto';

export const usuarioController = {
    async getProfile(userId) {
        try {
            const user = await userService.getUserProfile(userId);
            return NextResponse.json({ success: true, user });
        } catch (error) {
            const status = error.status || 400;
            return NextResponse.json({ error: error.message }, { status });
        }
    },

    async updateProfile(userId, request) {
        try {
            const body = await request.json();
            const dto = new UpdateUserDTO(body);
            dto.validate();

            const updatedUser = await userService.updateProfile(userId, {
                name: dto.name,
                email: dto.email
            });

            return NextResponse.json({
                success: true,
                message: 'Perfil actualizado correctamente',
                user: updatedUser
            });
        } catch (error) {
            const status = error.status || 400;
            return NextResponse.json({ error: error.message }, { status });
        }
    },

    async getAllUsers() {
        try {
            const users = await userService.getAllUsers();
            return NextResponse.json({ success: true, users });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
};
