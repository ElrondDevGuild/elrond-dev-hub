import Joi from "joi";
import {NextApiRequest} from "next";
import Response from "./Response";

export default abstract class BaseAction {
    public abstract handle(req: NextApiRequest): Response | Promise<Response>;

    public rules(): Joi.Schema | null | Promise<Joi.Schema | null> {
        return null;
    }
};