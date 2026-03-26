import { authController } from './auth.controller';

export const authRoutes = {
    login: (req) => authController.login(req),
    register: (req) => authController.register(req),
    logout: () => authController.logout(),
    me: (userId) => authController.getMe(userId)
};
