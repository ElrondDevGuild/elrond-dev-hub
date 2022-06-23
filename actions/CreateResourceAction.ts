import Joi from 'joi';
import { NextApiRequest } from 'next';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { ResourceRepository } from '../repositories/ResourceRepository';
import { ResourceTagRepository } from '../repositories/ResourceTagRepository';
import { TagRepository } from '../repositories/TagRepository';
import { MediaResource } from '../types/supabase';
import { serverApi } from '../utils/api';
import ApiResponse from './_base/ApiResponse';
import BaseAction from './_base/BaseAction';
import {createSlug} from "../utils/slugify";

export default class CreateResourceAction extends BaseAction {
  async handle(req: NextApiRequest): Promise<ApiResponse> {
    const {body} = req;
    const tags = body.tags;
    delete body.tags;

    const resource = await this.createResource(body);
    const resourceWithTags = await this.setResourceTags(resource, tags);
    const slug = await this.setSlug(resourceWithTags);

    // Generate thumbnail image
    this.generateThumbnailImage(resource);

    return new ApiResponse().body({...resourceWithTags, slug}).status(201);
  }

  async rules(): Promise<Joi.Schema> {
    const categoryRepo = new CategoryRepository();
    const categories = await categoryRepo.getIds();

    // todo: validate unique url
    return Joi.object({
      title: Joi.string().required(),
      author: Joi.string().required(),
      description: Joi.string().required().min(30).max(256),
      category_id: Joi.number()
        .required()
        .valid(...categories)
        .messages({
          "any.only": "Invalid Category",
        }),
      resource_url: Joi.string().uri().required(),
      tags: Joi.array().items(Joi.string().optional().allow("")),
      curator_address: Joi.string().optional().allow("", null),
    }).required();
  }

  private async createResource(resource: Omit<MediaResource, "id">): Promise<MediaResource> {
    const resourceRepo = new ResourceRepository();
    const { data, error } = await resourceRepo.create(resource);
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

  private async setSlug(resource: MediaResource): Promise<string> {
    const resourceRepo = new ResourceRepository();
    // Generate and save slug
    const slug = createSlug(resource);
    const {error} = await resourceRepo.update(resource.id, {slug});
    if (error) {
      throw error;
    }

    return slug;
  }

  private async generateThumbnailImage(resource: MediaResource) {
    await serverApi.post(`/resources/og-image`, {
      resource_id: resource.id,
      resource_url: resource.resource_url,
    });
  }
}
