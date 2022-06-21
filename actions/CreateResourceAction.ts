import BaseAction from "./_base/BaseAction";
import {NextApiRequest, NextApiResponse} from "next";
import Response from "./_base/Response";
import Joi from "joi";
import {CategoryRepository} from "../repositories/CategoryRepository";
import {ResourceRepository} from "../repositories/ResourceRepository";
import {MediaResource} from "../types/supabase";
import {TagRepository} from "../repositories/TagRepository";
import {ResourceTagRepository} from "../repositories/ResourceTagRepository";

export default class CreateResourceAction extends BaseAction {
    async handle(req: NextApiRequest): Promise<Response> {
        const {body} = req;
        const tags = body.tags;
        delete body.tags;

        const resource = await this.createResource(body);
        const resourceWithTags = await this.setResourceTags(resource, tags);


        return new Response().body(resourceWithTags).status(201);
    }

    async rules(): Promise<Joi.Schema> {
        const categoryRepo = new CategoryRepository();
        const categories = await categoryRepo.getIds();
        console.log(categories);

        return Joi.object({
            title: Joi.string().required(),
            author: Joi.string().required(),
            description: Joi.string().required().max(256),
            category_id: Joi.number().required().valid(...categories).messages({
                "any.only": "Invalid Category"
            }),
            resource_url: Joi.string().uri().required(),
            curator_address: Joi.string().optional(),
            tags: Joi.array().items(Joi.string()),

        }).required();

    }

    private async createResource(resource: Omit<MediaResource, "id">): Promise<MediaResource> {
        const resourceRepo = new ResourceRepository();
        const {data, error} = await resourceRepo.create(resource);
        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    private async setResourceTags(resource: MediaResource, tags: string[]): Promise<MediaResource> {
        const tagsRepo = new TagRepository();
        const resourceTagsRepo = new ResourceTagRepository();
        const allTags = await tagsRepo.createNotExisting(tags);

        return resourceTagsRepo.assignResourceTags(resource, allTags);
    }
};