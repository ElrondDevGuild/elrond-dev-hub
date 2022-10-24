import BaseAction from "../_base/BaseAction";
import {ApiRequest} from "../_base/handler";
import ApiResponse from "../_base/ApiResponse";
import ApiError from "../../errors/ApiError";
import ReviewsRepository from "../../repositories/ReviewsRepository";

export default class ListReviewsAction extends BaseAction {
    async handle(req: ApiRequest): Promise<ApiResponse> {
        const {user, query: {bounty_id, user_id, reviewer_id}} = req;

        if (!(user_id || reviewer_id)) {
            throw new ApiError(
                "At least one of user_id or reviewer_id is required",
                422
            );
        }

        const reviews = await new ReviewsRepository().list({
            bountyId: bounty_id as string,
            reviewerId: reviewer_id as string,
            userId: user_id as string
        });

        return new ApiResponse().body(reviews);
    }

    isPrivate(): boolean {
        return false;
    }
};