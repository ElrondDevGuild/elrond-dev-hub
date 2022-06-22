import BaseAction from "./_base/BaseAction";
import {NextApiRequest} from "next";
import ApiResponse from "./_base/ApiResponse";
import {TagRepository} from "../repositories/TagRepository";

export default class ListTagsAction extends BaseAction {
    async handle(req: NextApiRequest): Promise<ApiResponse> {
        const {data} = await new TagRepository().all("id,title").order("title");

        return new ApiResponse({body: data});

    }

}