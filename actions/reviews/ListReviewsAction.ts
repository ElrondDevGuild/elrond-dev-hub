import BaseAction from "../_base/BaseAction";
import {ApiRequest} from "../_base/handler";
import ApiResponse from "../_base/ApiResponse";
import ReviewsRepository from "../../repositories/ReviewsRepository";
import Joi from "joi";

export default class ListReviewsAction extends BaseAction {
    async handle(req: ApiRequest): Promise<ApiResponse> {
        const {user, query: {bounty_id, user_id, reviewer_id, type}} = req;

        const reviews = await new ReviewsRepository().list({
            bountyId: bounty_id as string,
            reviewerId: reviewer_id as string,
            userId: user_id as string,
            type: type as "bounty" | "application"
        });

        return new ApiResponse().body(reviews);
    }

    rules(): Joi.Schema {
        return Joi.object({
            type: Joi.string().required().allow("bounty", "application"),
            reviewer_id: Joi.when("user_id", {
                not: Joi.exist(),
                then: Joi.string().required(),
                otherwise: Joi.string().optional(),
            })
        });
    }
};