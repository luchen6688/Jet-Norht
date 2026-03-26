import { auditRepository } from './audit.repository';

export const auditService = {
    async logEvent({ userId, event, detail, ipAddress }) {
        return auditRepository.create({ userId, event, detail, ipAddress });
    },

    async getLogs(limit) {
        return auditRepository.findAll(limit);
    },

    async getUserLogs(userId) {
        return auditRepository.findByUser(userId);
    }
};
