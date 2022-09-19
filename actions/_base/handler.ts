import {NextApiRequest, NextApiResponse} from "next";
import Joi, {ValidationError} from "joi";
import BaseAction from "./BaseAction";
import {User} from "../../types/supabase";
import {Env} from "@next/env";
import UserRepository from "../../repositories/UserRepository";
import AuthenticationError from "../../errors/AuthenticationError";
import NotFoundError from "../../errors/NotFoundError";
import ApiError from "../../errors/ApiError";
import jwt from "jsonwebtoken";


type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type ApiActionType = { new(): BaseAction } & typeof BaseAction;

type ApiMethodHandler = {
    [key in HttpMethod]?: ApiActionType;
};

export interface ApiRequest {
    query: {
        [key: string]: string | string[];
    };
    cookies: {
        [key: string]: string;
    };
    body: any;
    env: Env;
    user: User | null;
}

export const handler = (handler: ApiMethodHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const method: HttpMethod = <HttpMethod>req.method?.toLowerCase();
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
            const user = await handleAuthorisation(action, req);
            await handleValidation(action, req);

            const result = await Promise.resolve(action.handle({...req, user}));
            const cacheHeader = result.getCache();
            if (cacheHeader) {
                res.setHeader('Cache-Control', cacheHeader);
            }

            return res.status(result.getStatus()).json(result.getBody());

        } catch (e: any) {
            if (e instanceof ValidationError) {
                return res.status(422).json({
                    error: 'Invalid data provided',
                    details: e.details
                });
            }
            if (e instanceof AuthenticationError) {
                return res.status(401).json({error: e.message});
            }
            if (e instanceof NotFoundError) {
                return res.status(404).json({error: e.message});
            }
            if (e instanceof ApiError) {
                return res.status(e.getStatus()).json({error: e.message});
            }

            res.status(500).json({error: e.message});
        }
    }
};

const resolveUser = async (req: NextApiRequest): Promise<User | null> => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return null;
    }
    const userRepo = new UserRepository();
    const token = authHeader.replace('Bearer ', '');
    try {
        // @ts-ignore
        const decoded = jwt.verify(token, process.env.AUTH_SECRET_KEY);

        return await userRepo.findById(decoded.user.wallet);
    } catch (e) {
        return null;
    }

}

const handleValidation = async <T extends BaseAction>(action: T, req: NextApiRequest) => {
    const rules = await Promise.resolve(action.rules());
    if (null !== rules) {
        return Joi.attempt({...req.body, ...req.query}, rules, {
            abortEarly: false,
            allowUnknown: true
        });
    }

    return true;
};

const handleAuthorisation = async <T extends BaseAction>(
    action: T,
    req: NextApiRequest
): Promise<User | null> => {
    const user = await resolveUser(req);
    if (null === user && action.isPrivate()) {
        throw new AuthenticationError();
    }

    return user;
}
