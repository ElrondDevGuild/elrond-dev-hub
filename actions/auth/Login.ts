import BaseAction from "../_base/BaseAction";
import {ApiRequest} from "../_base/handler";
import ApiResponse from "../_base/ApiResponse";
import Joi from "joi";
import AuthNonceRepository from "../../repositories/AuthNonceRepository";
import UserRepository from "../../repositories/UserRepository";
import ElrondValidator from "../../utils/auth/ElrondValidator";
import ApiError from "../../errors/ApiError";
import jwt from "jsonwebtoken";


export default class Login extends BaseAction {
    async handle(req: ApiRequest): Promise<ApiResponse> {
        const {address, signature, nonce} = req.body;
        const nonceRepo = new AuthNonceRepository();
        const nonceEntity = await nonceRepo.findById(nonce);
        if (!nonceEntity) {
            throw new ApiError("Invalid nonce");
        }


        const isValid = new ElrondValidator().validate(signature, address, nonceEntity.id);
        if (!isValid) {
            throw new ApiError("Invalid signature");
        }

        const userRepo = new UserRepository();
        const user = await userRepo.findOrCreate(address);


        const secret = process.env.AUTH_SECRET_KEY;
        if (!secret) {
            throw new ApiError("Something went wrong", 500);
        }


        const token = jwt.sign({user}, secret);


        return new ApiResponse().body({user, token});
    }


    rules(): Joi.Schema {
        return Joi.object({
            address: Joi.string().required().custom((value, helpers) => {
                if (!value.startsWith("erd1")) {
                    return helpers.error("any.custom");
                }
                return value;
            }),
            signature: Joi.string().required(),
            nonce: Joi.string().required(),
        });
    }

    isPrivate(): boolean {
        return false;
    }

};