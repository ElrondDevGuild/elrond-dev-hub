import BaseAction from "../_base/BaseAction";
import {ApiRequest} from "../_base/handler";
import ApiResponse from "../_base/ApiResponse";
import BountyRepository from "../../repositories/BountyRepository";

export default class GetBountyAction extends BaseAction {
    async handle(req: ApiRequest): Promise<ApiResponse> {
        const {bountyId} = req.query;
        const bounty = await new BountyRepository().findOrFail(bountyId as string);

        return new ApiResponse().body({...bounty});
    }

    isPrivate(): boolean {
        return true;
    }
};