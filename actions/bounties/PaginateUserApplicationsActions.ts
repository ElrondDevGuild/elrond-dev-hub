import Joi from 'joi';

import ApplicationsRepository from '../../repositories/ApplicationsRepository';
import ApiResponse from '../_base/ApiResponse';
import BaseAction from '../_base/BaseAction';
import { ApiRequest } from '../_base/handler';

export default class PaginateUserApplicationsActions extends BaseAction {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    let { page, page_size: size, owner_id } = req.query;
    const { data, count } = await new ApplicationsRepository()
      //@ts-ignore
      .paginate({ page, size, owner: owner_id });

    const applications = (data || []).map((application) => ({
      ...application,
      message: "********",
    }));

    return new ApiResponse({ body: { applications, count } });
  }

  public isPrivate(): boolean {
    return false;
  }

  rules(): Joi.Schema {
    return Joi.object({
      owner_id: Joi.string().required(),
    });
  }
}
