import {useEffect, useState} from "react";
import {UserReview} from "../../../types/supabase";
import {api} from "../../../utils/api";
import UserReviewsList from "./UserReviewsList";
import ReviewsLoader from "./ReviewsLoader";

export default function BountyReviewsList({userId}: { userId: string }) {
    const [reviews, setReviews] = useState<UserReview[]>([]);
    const [loading, setLoading] = useState(false);

    const loadItems = async () => {
        setLoading(true);
        try {
            const {data} = await api.get("user/reviews", {
                params: {
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
    }, []);

    if (loading) {
        return <ReviewsLoader />
    }

    return <UserReviewsList reviews={reviews}/>;
};