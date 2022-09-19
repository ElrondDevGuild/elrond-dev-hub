import {ucFirst} from "../utils/presentation";

export default class NotFoundError extends Error {
    constructor(entity: string, ...params: any) {
        super(...params);
        this.message = `${ucFirst(entity)} not found`;
        this.name = "NotFoundError";
    }
};