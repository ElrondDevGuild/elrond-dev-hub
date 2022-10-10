import BaseAction from "../_base/BaseAction";
import {ApiRequest} from "../_base/handler";
import ApiResponse from "../_base/ApiResponse";
import SocialLinksRepository from "../../repositories/SocialLinksRepository";
import UserRepository from "../../repositories/UserRepository";
import NotFoundError from "../../errors/NotFoundError";


export default class ShowUser extends BaseAction {
    async handle(req: ApiRequest): Promise<ApiResponse> {
        let {user, query: {id}} = req;
        if (id && user!.id !== id) {
            user = await new UserRepository().findById(id as string);
            if (!user) {
                throw new NotFoundError("user");
            }
        }
        const links = await new SocialLinksRepository().getSocialLinks(user!.id);

        return new ApiResponse().body({...user, social_links: links});
    }

};