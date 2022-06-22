import BaseAction from "./_base/BaseAction";
import ApiResponse from "./_base/ApiResponse";
import {NextApiRequest} from "next";
import Joi from "joi";
import {CategoryRepository} from "../repositories/CategoryRepository";
import {ResourceRepository} from "../repositories/ResourceRepository";

export default class PaginateResourcesAction extends BaseAction {
    async handle(req: NextApiRequest): Promise<ApiResponse> {
        const {page, page_size: size, categories, tags} = req.query;

        const resources = await new ResourceRepository()
            // @ts-ignore
            .paginate({page, size, categories, tags, published: true});

        return new ApiResponse({body: resources})
    }


    async rules(): Promise<Joi.Schema> {
        const categoryRepo = new CategoryRepository();
        const categories = (await categoryRepo.getIds()).map(item => item + "");

        return Joi.object({
            page: Joi.number().min(1).optional(),
            page_size: Joi.number().min(1).max(50).optional(),
            categories: Joi.array().items(Joi.valid(...categories)).messages({
                "any.only": "Invalid Category"
            }),
            tags: Joi.array().optional()
        });
    }
};