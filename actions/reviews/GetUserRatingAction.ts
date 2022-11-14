import ReviewsRepository from '../../repositories/ReviewsRepository';
import ApiResponse from '../_base/ApiResponse';
import BaseAction from '../_base/BaseAction';
import { ApiRequest } from '../_base/handler';

export default class GetUserRatingAction extends BaseAction {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    const { id } = req.query;
    const rating = await new ReviewsRepository().getUserRating(id as string);

    return new ApiResponse().body(rating);
  }

  isPrivate(): boolean {
    return false;
  }
}
