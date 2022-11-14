import BountyResourceRepository from '../../repositories/BountyResourceRepository';
import ApiResponse from '../_base/ApiResponse';
import BaseAction from '../_base/BaseAction';
import { ApiRequest } from '../_base/handler';

export default class ListBountyResourcesAction extends BaseAction {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    const repo = new BountyResourceRepository();
    const { bountyId } = req.query;
    const resources = await repo.listByBountyId(bountyId as string);

    return new ApiResponse().body(resources);
  }

  isPrivate(): boolean {
    return false;
  }
}
