import BaseAction from "../_base/BaseAction";
import {ApiRequest} from "../_base/handler";
import ApiResponse from "../_base/ApiResponse";
import BountyResourceRepository from "../../repositories/BountyResourceRepository";

export default class ListBountyResourcesAction extends BaseAction {
    async handle(req: ApiRequest): Promise<ApiResponse> {
        const repo = new BountyResourceRepository();
        const {bountyId} = req.query;
        const resources = await repo.listByBountyId(bountyId as string);

        return new ApiResponse().body(resources);
    }

};