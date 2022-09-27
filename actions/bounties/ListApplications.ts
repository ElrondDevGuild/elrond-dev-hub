import BaseAction from "../_base/BaseAction";
import {ApiRequest} from "../_base/handler";
import ApiResponse from "../_base/ApiResponse";
import BountyRepository from "../../repositories/BountyRepository";
import AuthorisationError from "../../errors/AuthorisationError";
import ApplicationsRepository from "../../repositories/ApplicationsRepository";

export default class ListApplications extends BaseAction {
    async handle(req: ApiRequest): Promise<ApiResponse> {
        const {query: {bountyId}, user} = req;
        const bounty = await new BountyRepository().findOrFail(bountyId as string);
        if (bounty.owner_id !== user?.id) {
            throw new AuthorisationError();
        }
        const applications = await new ApplicationsRepository().listByBountyId(bountyId as string);

        return new ApiResponse().body(applications);
    }

}