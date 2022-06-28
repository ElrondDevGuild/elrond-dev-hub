import { NextApiRequest } from 'next';

import { CategoryRepository } from '../repositories/CategoryRepository';
import ApiResponse from './_base/ApiResponse';
import BaseAction from './_base/BaseAction';

export default class ListCategoriesAction extends BaseAction {
  async handle(req: NextApiRequest): Promise<ApiResponse> {
    const categoriesRepo = new CategoryRepository();
    const { data } = await categoriesRepo.all("id, title").order("title");

    return new ApiResponse({ body: data }).cache(3600, 86400);
  }
}
