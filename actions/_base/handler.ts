import {NextApiRequest, NextApiResponse} from "next";
import Joi, {ValidationError} from "joi";
import BaseAction from "./BaseAction";


type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type ApiActionType = { new(): BaseAction } & typeof BaseAction;

type ApiMethodHandler = {
    [key in HttpMethod]?: ApiActionType;
};


export const handler = (handler: ApiMethodHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        // @ts-ignore
        const method: HttpMethod = req.method.toLowerCase();
        if (!handler[method]) {
            const allowedMethods = Object.keys(handler)
                .filter(method => ['get', 'post', 'put', 'patch', 'delete'].includes(method))
                .map(method => method.toUpperCase());

            return res.setHeader('Allow', allowedMethods)
                .status(405)
                .end(`Method ${method} Not Allowed`);
        }

        // @ts-ignore
        const action = new handler[method]();

        try {
            // Validate request
            const rules = await Promise.resolve(action.rules());
            if (null !== rules) {
                Joi.attempt({...req.body, ...req.query}, rules, {
                    abortEarly: false,
                    allowUnknown: true
                });
            }

            const result = await Promise.resolve(action.handle(req));

            return res.status(result.getStatus()).json(result.getBody());

        } catch (e: any) {
            if (e instanceof ValidationError) {
                return res.status(422).json({
                    error: 'Invalid data provided',
                    details: e.details
                });
            }

            res.status(500).json({error: e.message});
        }
    }
}
