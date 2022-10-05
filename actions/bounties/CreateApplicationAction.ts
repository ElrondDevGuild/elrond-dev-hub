import BaseAction from "../_base/BaseAction";
import ApiResponse from "../_base/ApiResponse";
import {ApiRequest} from "../_base/handler";
import BountyRepository from "../../repositories/BountyRepository";
import Joi from "joi";
import ApplicationsRepository from "../../repositories/ApplicationsRepository";
import {BountyApplication} from "../../types/supabase";

export default class CreateApplicationAction extends BaseAction {
    async handle(req: ApiRequest): Promise<ApiResponse> {
        const {query: {bountyId}, body: data, user} = req;
        const bounty = await new BountyRepository().findOrFail(bountyId as string);
        if (bounty.owner_id === user?.id) {
            return new ApiResponse()
                .status(403)
                .body({message: "You cannot apply to your own bounty"});
        }
        if (bounty.status !== "open") {
            return new ApiResponse()
                .status(403)
                .body({message: "This bounty is not open for applications"});
        }
        if (!data.terms) {
            return new ApiResponse()
                .status(422)
                .body({message: "You must accept the terms and conditions"});
        }

        const existingApplication = await this.getUserApplication(user?.id as string, bountyId as string);
        if (existingApplication) {
            return new ApiResponse()
                .status(422)
                .body({message: "You have already applied to this bounty"});
        }

        const application = await this.createApplication({
            message: data.message,
            user_id: user?.id,
            bounty_id: bountyId as string,
            approval_status: "pending",
            work_status: "pending"
        });

        return new ApiResponse().status(201).body(application);
    }

    rules(): Joi.Schema {
        return Joi.object({
            message: Joi.string().required(),
        });
    }

    private async createApplication(application: Partial<BountyApplication>): Promise<BountyApplication> {
        const applicationRepo = new ApplicationsRepository();
        const {data, error} = await applicationRepo.create(application);
        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    private async getUserApplication(userId: string, bountyId: string): Promise<BountyApplication | null> {
        const applicationRepo = new ApplicationsRepository();

        return await applicationRepo.findByUserIdAndBountyId(userId, bountyId);
    }


}