export default class ApiError extends Error {
    private readonly status: number;

    constructor(message: string, status: number = 422, ...params: any) {
        super(...params);
        this.message = message;
        this.status = status;
        this.name = "ApiError";
    }

    getStatus() {
        return this.status;
    }
};