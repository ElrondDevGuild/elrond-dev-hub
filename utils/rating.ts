import {ItemWithUserRating, User, UserRatings} from "../types/supabase";
import ReviewsRepository from "../repositories/ReviewsRepository";


export async function mapUserItemRating<T extends { user: User }>(
    items: T[]
): Promise<Array<ItemWithUserRating<T>>> {
    const userIds = new Set(items.map(item => item.user.id));
    // @ts-ignore
    const usersReviews = await new ReviewsRepository().getUsersRatings([...userIds]);
    const emptyRating: UserRatings = {
        bounties: {
            rating: 0,
            nbReviews: 0,
        },
        applications: {
            rating: 0,
            nbReviews: 0,
        }
    };


    return items.map((item: T) => ({
        ...item,
        user: {
            ...item.user,
            ratings: usersReviews.get(item.user.id) ?? emptyRating
        }
    }));
}