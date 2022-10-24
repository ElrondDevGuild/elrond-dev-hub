import {BaseRepository} from "./base/BaseRepository";
import {User, UserReview} from "../types/supabase";
import {supabaseAdmin} from "../utils/supabase";
import {REVIEWS_TABLE} from "../utils/dbtables";
import {getUserHandle} from "../utils/profile";

export default class ReviewsRepository extends BaseRepository<UserReview> {
    constructor() {
        const table = supabaseAdmin.from<UserReview>(REVIEWS_TABLE);
        super(table, "id");
    }

    async list(
        {
            bountyId,
            reviewerId,
            userId
        }: { bountyId?: string, reviewerId?: string, userId?: string }
    ): Promise<UserReview[]> {
        let query = this._table.select(
            `*,
                    reviewer:reviewer_id(id, name, wallet, avatar_url, handle),
                    bounty:bounty_id(id, title)`
        ).order("created_at");

        if (bountyId) {
            query = query.eq("bounty_id", bountyId);
        }

        if (reviewerId) {
            query = query.eq("reviewer_id", reviewerId);
        }

        if (userId) {
            query = query.eq("user_id", userId);
        }

        const {data, error} = await query;
        if (error) {
            throw error;
        }

        return (data || []).map(review => ({
            ...review,
            reviewer: {
                avatar_url:review.reviewer.avatar_url,
                name: review.reviewer.name || getUserHandle(review.reviewer as User)
            }
        }));
    }
};