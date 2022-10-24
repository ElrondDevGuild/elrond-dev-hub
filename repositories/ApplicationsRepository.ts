import {BaseRepository} from "./base/BaseRepository";
import {ApplicationApprovalStatus, BountyApplication} from "../types/supabase";
import {supabaseAdmin} from "../utils/supabase";
import {BOUNTY_APPLICATIONS_TABLE} from "../utils/dbtables";

export default class ApplicationsRepository extends BaseRepository<BountyApplication> {
    constructor() {
        const table = supabaseAdmin.from<BountyApplication>(BOUNTY_APPLICATIONS_TABLE);
        super(table, "id");
    }

    async listByBountyId(bountyId: string) {
        const {data, error} = await this._table.select("*, user:user_id(*)")
            .eq("bounty_id", bountyId);
        if (error) {
            throw error;
        }

        return data;
    }

    async findByUserIdAndBountyId(userId: string, bountyId: string) {
        const {data, error} = await this._table.select("*")
            .eq("user_id", userId)
            .eq("bounty_id", bountyId)
            .maybeSingle();
        if (error) {
            throw error;
        }

        return data;
    }

    async updateApprovalStatus(id: string, status: ApplicationApprovalStatus) {
        const {data, error} = await this._table.update({
                approval_status: status,
                approval_status_timestamp: new Date().toISOString()
            })
            .eq("id", id)
            .maybeSingle();
        if (error || !data) {
            throw new Error("Failed to update application status");
        }

        return data;

    }

    async paginate(
        {
            page,
            size,
            owner,
        }: {
            page?: number;
            size?: number;
            owner: string;
        }
    ) {
        const {from, to} = ApplicationsRepository.computePageRange({page, size});
        const {data, error, count} = await this._table.select(
            "*, bounty:bounty_id(id, title)",
            {count: "exact"}
            )
            .eq("user_id", owner)
            .order("created_at", {ascending: false})
            .range(from, to);

        if (error) {
            throw error;
        }


        return {data, count};
    }
};