import { bookingController } from './bookings.controller';

export const bookingRoutes = {
    create: (req, userId) => bookingController.create(req, userId),
    list: (req, userId) => bookingController.list(req, userId),
    get: (id) => bookingController.getById(id),
    update: (id, req, userId) => bookingController.update(id, req, userId)
};
