import BaseAction from "../_base/BaseAction";
import {ApiRequest} from "../_base/handler";
import ApiResponse from "../_base/ApiResponse";
import Joi from "joi";
import {User, UserSocialLink} from "../../types/supabase";
import UserRepository from "../../repositories/UserRepository";
import {getMaiarAvatar} from "../../utils/profile";
import SocialLinksRepository from "../../repositories/SocialLinksRepository";

export default class UpdateUserAction extends BaseAction {
    async handle(req: ApiRequest): Promise<ApiResponse> {
        const {user, body: {name, description, social_links}} = req;

        const updatedUser = await this.updateUser(user!, {name, description});
        const updatedSocialLinks = await this.updateSocialLinks(user!.id, social_links);

        return new ApiResponse().body({...updatedUser, social_links: updatedSocialLinks});
    }

    rules(): Joi.Schema {
        return Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required().min(30),
            social_links: Joi.array().items(Joi.object({
                platform: Joi.string()
                    .required()
                    .valid("twitter", "github", "linkedin", "discord", "telegram"),
                username: Joi.string().required().label("Handle")
            }))
        });
    }

    private async updateUser(
        user: User,
        {
            name,
            description
        }: { name: string, description: string | null }
    ): Promise<User> {
        const userRepo = new UserRepository();
        // First we check if the user has a profile image and
        // if not, then we get the one from maiar
        let avatarUrl = null;
        if (!user.avatar_url) {
            avatarUrl = await getMaiarAvatar(user.wallet);
        }
        const {data, error} = await userRepo.update(user.id, {
            name,
            description,
            avatar_url: avatarUrl
        });
        if (error) {
            throw new Error(error.message);
        }

        return data[0];
    }

    private async updateSocialLinks(
        userId: string,
        socialLinks: Omit<UserSocialLink, "id" | "user_id">[]
    ): Promise<UserSocialLink[]> {
        const repo = new SocialLinksRepository();

        return await repo.setSocialLinks(userId, socialLinks);
    }
};