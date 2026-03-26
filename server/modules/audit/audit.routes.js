import { auditController } from './audit.controller';

export const auditRoutes = {
    create: (req) => auditController.create(req),
    list: (req) => auditController.getLogs(req)
};
