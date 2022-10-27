import {UserRating as UserRatingType} from "../types/supabase";
import ReviewRating from "./ReviewRating";
import Link from "next/link";
import {profilePath} from "../utils/routes";

export default function UserRating({userId, rating}: { userId: string, rating: UserRatingType }) {


    return (

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
            <ReviewRating rating={rating.rating}/>
            <Link href={`${profilePath}/${userId}`}>
                <a className="text-theme-text dark:text-theme-text-dark text-xs underline">
                    ({rating.nbReviews} {rating.nbReviews === 1 ? 'review' : 'reviews'})
                </a>
            </Link>
        </div>

    );
};