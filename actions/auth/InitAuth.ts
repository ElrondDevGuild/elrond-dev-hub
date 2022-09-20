import BaseAction from "../_base/BaseAction";
import {ApiRequest} from "../_base/handler";
import ApiResponse from "../_base/ApiResponse";
import AuthNonceRepository from "../../repositories/AuthNonceRepository";
import ApiError from "../../errors/ApiError";

export default class InitAuth extends BaseAction {
    async handle(req: ApiRequest): Promise<ApiResponse> {
        const nonceRepo = new AuthNonceRepository();
        const {error, data: authNonce} = await nonceRepo.create({});
        if (error || !authNonce) {
            throw new ApiError("Failed to init auth");
        }

        return new ApiResponse().body({nonce: authNonce.id});

    }


    isPrivate(): boolean {
        return false;
    }
};