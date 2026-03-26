import { userController } from './usuario.controller';

export const userRoutes = {
    getProfile: (userId) => userController.getProfile(userId),
    updateProfile: (userId, req) => userController.updateProfile(userId, req),
    list: () => userController.getAllUsers()
};
