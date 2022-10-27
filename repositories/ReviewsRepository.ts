import {BaseRepository} from "./base/BaseRepository";
import {User, UserRatings, UserReview} from "../types/supabase";
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

            // @ts-ignore
            return review.reviewer_id === review.application.user_id;

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

    async findReview(
        {
            applicationId,
            reviewerId,
            userId
        }: { applicationId: string, reviewerId: string, userId: string }
    ): Promise<UserReview | null> {
        const {data, error} = await this._table.select('*')
            .eq("bounty_application_id", applicationId)
            .eq("reviewer_id", reviewerId)
            .eq("user_id", userId)
            .maybeSingle();

        if (error) {throw error;}

        return data;
    }

    async getUserRating(id: string): Promise<UserRatings> {
        const ratings = await this.getUsersRatings([id]);

        return ratings.get(id) ?? {
            bounties: {
                rating: 0,
                nbReviews: 0,
            },
            applications: {
                rating: 0,
                nbReviews: 0,
            }
        };
    }

    async getUsersRatings(userIds: string[]): Promise<Map<string, UserRatings>> {
        const {data, error} = await this._table.select(`
        *,
         application:bounty_application_id(
                        id,
                        bounty_id,
                        user_id,
                        bounty:bounty_id(id, title, owner_id)
                    )
        `)
            .in("user_id", userIds);

        if (error) {
            throw error;
        }

        const usersReviews = (data || []).reduce((map: Map<string, UserReview[]>, review: UserReview) => {
            const currentReviews = map.get(review.user_id) ?? [];
            map.set(review.user_id, [...currentReviews, review]);

            return map;
        }, new Map<string, UserReview[]>());

        const usersRatings = new Map<string, UserRatings>();


        // @ts-ignore
        for (const [key, value] of usersReviews) {
            const bountiesReviews = value.filter(
                (review: any) => review.reviewer_id === review.application.user_id
            );
            const applicationsReviews = value.filter(
                (review: any) => review.reviewer_id === review.application.bounty.owner_id
            );
            const bounties = {
                rating: bountiesReviews.reduce((sum: number, review: UserReview) => sum + review.rating, 0),
                nbReviews: bountiesReviews.length,
            };
            const applications = {
                rating: applicationsReviews.reduce((sum: number, review: UserReview) => sum + review.rating, 0),
                nbReviews: applicationsReviews.length,
            };

            usersRatings.set(key, {bounties, applications});
        }

        return usersRatings;

    }

};