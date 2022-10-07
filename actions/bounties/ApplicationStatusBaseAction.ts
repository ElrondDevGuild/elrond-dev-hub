import BaseAction from "../_base/BaseAction";
import {ApiRequest} from "../_base/handler";
import {Bounty, BountyApplication, User} from "../../types/supabase";
import ApplicationsRepository from "../../repositories/ApplicationsRepository";
import NotFoundError from "../../errors/NotFoundError";
import BountyRepository from "../../repositories/BountyRepository";
import AuthorisationError from "../../errors/AuthorisationError";
import ApiResponse from "../_base/ApiResponse";
import ApiError from "../../errors/ApiError";
import {ucFirst} from "../../utils/presentation";

export default abstract class ApplicationStatusBaseAction extends BaseAction {
    protected async assertHasAccess(
        application: BountyApplication | null,
        bounty: Bounty | null,
        user: User
    ): Promise<void> {
        if (!application || !bounty || application.bounty_id !== bounty.id) {
            throw new NotFoundError("Application");
        }

        if (bounty.owner_id !== user?.id) {
            throw new AuthorisationError();
        }

        if (application!.approval_status !== "pending") {
            throw new ApiError("Application has already been accepted or rejected", 409);
        }

        if (!["open", "work_started"].includes(bounty.status)) {
            throw new ApiError(`Bounty is ${ucFirst(bounty.status.replace("_", " "))}`, 409);
        }
    }
}