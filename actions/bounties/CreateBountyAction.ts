import BaseAction from "../_base/BaseAction";
import ApiResponse from "../_base/ApiResponse";
import {ApiRequest} from "../_base/handler";
import Joi from "joi";
import {experienceOptions, issueTypeOptions, typeOptions} from "../../utils/bounties";
import {Bounty, BountyResource} from "../../types/supabase";
import BountyRepository from "../../repositories/BountyRepository";
import {TagRepository} from "../../repositories/TagRepository";
import BountyTagRepository from "../../repositories/BountyTagRepository";
import BountyResourceRepository from "../../repositories/BountyResourceRepository";

export default class CreateBountyAction extends BaseAction {
    async handle(req: ApiRequest): Promise<ApiResponse> {
        const {body: data, user} = req;
        const tags = data.tags;
        const resources = data.resources;
        delete data.tags;
        delete data.resources;

        const bounty = await this.createBounty({
            ...data,
            status: "open",
            owner_id: user?.id,
            project_type: "single_worker",
            requires_work_permission: true
        });
        const bountyWithTags = await this.setBountyTags(bounty, tags);
        const bountyResources = await this.storeBountyResources(bountyWithTags, resources);


        return new ApiResponse()
            .status(201)
            .body({...bountyWithTags, resources: bountyResources});
    }

    rules(): Joi.Schema {
        return Joi.object({
            title: Joi.string().required().max(100),
            description: Joi.string().required(),
            acceptance_criteria: Joi.string().required().label("Acceptance Criteria"),
            // project_type: Joi.string().required().valid(...typeOptions.map(type => type.id)).label("Type"),
            issue_type: Joi.string().required().valid(...issueTypeOptions.map(type => type.id)).label("Issue Type"),
            // requires_work_permission: Joi.boolean().required().label("Permissions"),
            experience_level: Joi.string().required().valid(...experienceOptions.map(type => type.id)).label("Experience Level"),
            repository_url: Joi.string().required().uri().label("Repository URL"),
            repository_issue_url: Joi.string().optional().allow("").uri().label("Issue URL"),
            value: Joi.number().required().min(10).label("Price"),
        });
    }

    private async createBounty(bounty: Partial<Bounty>): Promise<Bounty> {
        const bountyRepo = new BountyRepository();
        const {data, error} = await bountyRepo.create(bounty);
        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    private async setBountyTags(bounty: Bounty, tags: string[]): Promise<Bounty> {
        const tagRepo = new TagRepository();
        const allTags = await tagRepo.createNotExisting(tags);
        const bountyTagRepo = new BountyTagRepository();

        return await bountyTagRepo.assignBountyTags(bounty, allTags);

    }

    private async storeBountyResources(bounty: Bounty, resources: Partial<BountyResource>[]): Promise<BountyResource[]> {
        const resourceRepo = new BountyResourceRepository();
        const {data, error} = await resourceRepo.createMany(resources.map(resource => ({
            ...resource,
            bounty_id: bounty.id,
            user_id: bounty.owner_id
        })));

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
};