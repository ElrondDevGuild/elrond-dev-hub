import Joi from "joi";
import { NextApiRequest } from "next";

import { CategoryRepository } from "../repositories/CategoryRepository";
import { ResourceRepository } from "../repositories/ResourceRepository";
import ApiResponse from "./_base/ApiResponse";
import BaseAction from "./_base/BaseAction";

export default class PaginateResourcesAction extends BaseAction {
  async handle(req: NextApiRequest): Promise<ApiResponse> {
    const { page, page_size: size, categories, category, tags } = req.query;

    const { data: resources, count } = await new ResourceRepository()
      // @ts-ignore
      .paginate({ page, size, categories, category, tags, published: true });

    //return new ApiResponse({ body: { resources, count } }).cache(900, 1800);
    return new ApiResponse({ body: { resources, count } });
  }

  async rules(): Promise<Joi.Schema> {
    const categoryRepo = new CategoryRepository();
    const categories = (await categoryRepo.getIds()).map((item) => item + "");

    return Joi.object({
      page: Joi.number().min(0).optional(),
      page_size: Joi.number().min(1).max(50).optional(),
      category: Joi.valid(...categories).optional(),
      categories: Joi.array()
        .items(Joi.valid(...categories))
        .messages({
          "any.only": "Invalid Category",
        }),
      tags: Joi.array().optional(),
    });
  }
}
