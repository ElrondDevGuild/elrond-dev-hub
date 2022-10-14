import BaseAction from "../_base/BaseAction";
import {ApiRequest} from "../_base/handler";
import ApiResponse from "../_base/ApiResponse";
import BountyRepository from "../../repositories/BountyRepository";

export default class PaginateBountiesAction extends BaseAction {
    async handle(req: ApiRequest): Promise<ApiResponse> {
        let {page, page_size: size, tags, owner} = req.query;
        if (tags) {
            tags = Array.isArray(tags) ? tags : [tags];
        }
        const {data: bounties, count} = await new BountyRepository()
            // @ts-ignore
            .paginate({page, size, tags, owner, withApplications: true});

        const _bounties = bounties.map(bounty => {
            const {applications, ...rest} = bounty;
            return {
                ...rest,
                applicationsCount: applications?.length || 0
            };
        });
        

        return new ApiResponse({body: {bounties: _bounties, count}});
    }

    isPrivate(): boolean {
        return false;
    }

};