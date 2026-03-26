export class CreateAuditDTO {
    constructor({ userId, event, detail, ipAddress }) {
        this.userId = userId;
        this.event = event;
        this.detail = detail;
        this.ipAddress = ipAddress;
    }

    validate() {
        if (!this.event) {
            throw new Error('El evento es obligatorio.');
        }
    }
}
