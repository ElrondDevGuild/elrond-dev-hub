import AuthorisationError from '../../errors/AuthorisationError';
import ApplicationsRepository from '../../repositories/ApplicationsRepository';
import BountyRepository from '../../repositories/BountyRepository';
import { mapUserItemRating } from '../../utils/rating';
import ApiResponse from '../_base/ApiResponse';
import BaseAction from '../_base/BaseAction';
import { ApiRequest } from '../_base/handler';

export default class ListBountyApplicationsAction extends BaseAction {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    const {
      query: { bountyId },
      user,
    } = req;
    const bounty = await new BountyRepository().findOrFail(bountyId as string);
    if (bounty.owner_id !== user?.id) {
      throw new AuthorisationError();
    }
    const applications = await new ApplicationsRepository().listByBountyId(bountyId as string);
    const applicationsWithUserRating = await mapUserItemRating(applications);

    return new ApiResponse().body(
      applicationsWithUserRating.map((e) => {
        return {
          bounty,
          ...e,
        };
      })
    );
  }
}
