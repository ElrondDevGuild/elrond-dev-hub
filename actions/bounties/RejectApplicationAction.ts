import ApplicationStatusBaseAction from "./ApplicationStatusBaseAction";
import {ApiRequest} from "../_base/handler";
import ApiResponse from "../_base/ApiResponse";
import ApplicationsRepository from "../../repositories/ApplicationsRepository";
import {User} from "../../types/supabase";
import BountyRepository from "../../repositories/BountyRepository";

export default class RejectApplicationAction extends ApplicationStatusBaseAction {
    async handle(req: ApiRequest): Promise<ApiResponse> {
        const {query: {bountyId, applicationId}, user} = req;
        const repository = new ApplicationsRepository();
        const bountyRepository = new BountyRepository();
        const bounty = await bountyRepository.findById(bountyId as string);
        const application = await repository.findById(applicationId as string);

        await this.assertHasAccess(application, bounty, user as User);

        const bountyApplication = await repository.updateApprovalStatus(applicationId as string, "rejected");


        return new ApiResponse().body(bountyApplication);

    }

}