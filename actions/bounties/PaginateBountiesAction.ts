import BaseAction from "../_base/BaseAction";
import {ApiRequest} from "../_base/handler";
import ApiResponse from "../_base/ApiResponse";
import BountyRepository from "../../repositories/BountyRepository";
import {BountyStatus} from "../../types/supabase";

export default class PaginateBountiesAction extends BaseAction {
    async handle(req: ApiRequest): Promise<ApiResponse> {
        let {page, page_size: size, tags, owner} = req.query;
        if (tags) {
            tags = Array.isArray(tags) ? tags : [tags];
        }

        let status:BountyStatus[] = [];

        if (!owner) {
            // If the bounties are not filtered by owner, then
            // we'll only return the open ones
            status = ["open", "work_started", "work_submitted"];
        }else if (req.user?.id !== owner) {
            // If another user wants to see someone else's bounty,
            // then we'll filter the ones that are "pending", "expired", or "canceled"
            status = ["open", "completed", "work_started", "work_submitted"];
        }

        const {data: bounties, count} = await new BountyRepository()
            // @ts-ignore
            .paginate({page, size, tags, owner, status, withApplications: true});

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