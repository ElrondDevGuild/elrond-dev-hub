import {ApiRequest} from "../_base/handler";
import ApiResponse from "../_base/ApiResponse";
import BaseAction from "../_base/BaseAction";
import ApplicationsRepository from "../../repositories/ApplicationsRepository";
import NotFoundError from "../../errors/NotFoundError";

export default class GetOwnApplicationAction extends BaseAction {
    async handle(req: ApiRequest): Promise<ApiResponse> {
        const {bountyId} = req.query;
        const application = await new ApplicationsRepository()
            .findByUserIdAndBountyId(req.user?.id as string, bountyId as string);
        if (!application) {
            throw new NotFoundError("application");
        }

        return new ApiResponse().body(application);
    }

    isPrivate(): boolean {
        return true;
    }
};