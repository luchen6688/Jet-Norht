import { authController } from '@/server/modules/auth/auth.controller';

export async function POST(request) {
    return authController.register(request);
}
