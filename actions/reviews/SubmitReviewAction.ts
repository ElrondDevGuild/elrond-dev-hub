import Joi from 'joi';

import AuthorisationError from '../../errors/AuthorisationError';
import ApplicationsRepository from '../../repositories/ApplicationsRepository';
import BountyRepository from '../../repositories/BountyRepository';
import ReviewsRepository from '../../repositories/ReviewsRepository';
import ApiResponse from '../_base/ApiResponse';
import BaseAction from '../_base/BaseAction';
import { ApiRequest } from '../_base/handler';

export default class SubmitReviewAction extends BaseAction {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    const {
      user,
      body: { review, rating, application_id },
    } = req;
    const applicationsRepo = new ApplicationsRepository();
    const application = await applicationsRepo.findOrFail(application_id);
    if (user!.id !== application.user_id && user!.id !== application.bounty?.owner_id) {
      throw new AuthorisationError();
    }
    let reviewData = {
      review,
      rating,
      bounty_application_id: application.id,
      reviewer_id: user!.id,
      user_id: "",
    };

    // If the current user is the "worker", then it means that
    // the bounty "owner" is being reviewed.
    // Otherwise, it means that the bounty "owner" is reviewing
    // the "worker".
    if (user!.id === application.user_id) {
      reviewData.user_id = application.bounty!.owner_id;
    } else {
      reviewData.user_id = application.user_id;
    }

    const reviewsRepo = new ReviewsRepository();

    // We're making sure that another review was not already submitted.
    const existingReview = await reviewsRepo.findReview({
      reviewerId: reviewData.reviewer_id,
      userId: reviewData.user_id,
      applicationId: reviewData.bounty_application_id,
    });

    if (existingReview) {
      return ApiResponse.error("You already submitted your review for this application", 409);
    }

    const { data, error } = await reviewsRepo.create(reviewData);
    if (error) {
      throw error;
    }

    // If both reviews were given, mark the bounty as completed
    // TODO: Update this in case bounties with multiple workers will be enabled
    const reviewsRepoNew = new ReviewsRepository();
    const existingFirstReview = await reviewsRepoNew.findReview({
      reviewerId: reviewData.user_id,
      userId: reviewData.reviewer_id,
      applicationId: reviewData.bounty_application_id,
    });
    if (existingFirstReview) {
      const bountyRepository = new BountyRepository();
      await bountyRepository.updateStatus(application.bounty_id, "completed");
    }

    return new ApiResponse().body(data).status(201);
  }

  rules(): Joi.Schema {
    return Joi.object({
      review: Joi.string()
        .required()
        .min(30),
      rating: Joi.number()
        .required()
        .min(1)
        .max(5),
      application_id: Joi.string().required(),
    });
  }
}
