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
            userId,
            type
        }: {
            type: "bounty" | "application"
            bountyId?: string,
            reviewerId?: string,
            userId?: string
        }
    ): Promise<UserReview[]> {
        let query = this._table.select(
            `*,
                    reviewer:reviewer_id(id, name, wallet, avatar_url, handle),
                    application:bounty_application_id(
                        id,
                        bounty_id,
                        user_id,
                        bounty:bounty_id(id, title, owner_id)
                    )
                   )`
        ).order("created_at");


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

        // todo: filter at db level
        const reviews = (data || []).filter(review => {
            if (type === "application") {
                // We want the reviewer to be the bounty owner
                // @ts-ignore
                return review.reviewer_id === review.application.bounty.owner_id
            }

            return review.reviewer_id === review.user_id;

        });

        return reviews.map(review => {
            // @ts-ignore
            const {application, ...rest} = review
            return {
                ...rest,
                reviewer: {
                    avatar_url: review.reviewer.avatar_url,
                    name: review.reviewer.name || getUserHandle(review.reviewer as User)
                }
            }
        });
    }
};