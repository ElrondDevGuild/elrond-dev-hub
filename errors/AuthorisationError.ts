export default class AuthorisationError extends Error {
    constructor(...params: any) {
        super(...params);
        this.message = "Not Authorised";
        this.name = "AuthorisationError";
    }
}