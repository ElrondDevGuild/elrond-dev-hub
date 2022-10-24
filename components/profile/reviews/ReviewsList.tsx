import {useEffect, useState} from "react";
import {UserReview} from "../../../types/supabase";
import {api} from "../../../utils/api";
import UserReviewsList from "./UserReviewsList";
import ReviewsLoader from "./ReviewsLoader";

export default function ReviewsList(
    {
        userId,
        type
    }: { userId: string, type: "bounty" | "application" }
) {
    const [reviews, setReviews] = useState<UserReview[]>([]);
    const [loading, setLoading] = useState(false);

    const loadItems = async () => {
        setLoading(true);
        try {
            const {data} = await api.get("user/reviews", {
                params: {
                    type,
                    user_id: userId
                }
            });
            setReviews(data);
        } catch (e) {
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, [userId]);

    if (loading) {
        return <ReviewsLoader />
    }

    return <UserReviewsList reviews={reviews}/>;
};