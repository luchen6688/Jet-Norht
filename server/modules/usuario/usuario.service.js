import { userRepository } from './usuario.repository';
import { UserNotFoundError } from './usuario.errors';

export const userService = {
    async getUserProfile(userId) {
        const user = userRepository.findById(userId);
        if (!user) {
            throw new UserNotFoundError();
        }
        return user;
    },

    async updateProfile(userId, data) {
        const user = userRepository.findById(userId);
        if (!user) {
            throw new UserNotFoundError();
        }
        
        userRepository.update(userId, data);
        return userRepository.findById(userId);
    },

    async getAllUsers() {
        return userRepository.findAll();
    }
};
