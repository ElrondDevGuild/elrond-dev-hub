import { NextApiRequest } from 'next';

import { CategoryRepository } from '../repositories/CategoryRepository';
import ApiResponse from './_base/ApiResponse';
import BaseAction from './_base/BaseAction';
import {ApiRequest} from "./_base/handler";

export default class ListCategoriesAction extends BaseAction {
  async handle(req: ApiRequest): Promise<ApiResponse> {
    const categoriesRepo = new CategoryRepository();
    const { data } = await categoriesRepo.all("id, title").order("title");

    return new ApiResponse({ body: data }).cache(3600, 86400);
  }
  isPrivate(): boolean {
    return false;
  }
}
