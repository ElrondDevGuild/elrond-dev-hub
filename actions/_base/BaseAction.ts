import Joi from "joi";
import ApiResponse from "./ApiResponse";
import {ApiRequest} from "./handler";

export default abstract class BaseAction {
    public abstract handle(req: ApiRequest): ApiResponse | Promise<ApiResponse>;

    public rules(): Joi.Schema | null | Promise<Joi.Schema | null> {
        return null;
    }

    public isPrivate(): boolean {
        return true;
    }
};