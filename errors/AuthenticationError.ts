export default class AuthenticationError extends Error {
    constructor(...params: any) {
        super(...params);
        this.message = "Not Authenticated";
        this.name = "AuthenticationError";
    }
}