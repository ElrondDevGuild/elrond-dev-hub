import {UserReview} from "../types/supabase";
import {BsStarFill as StarIcon} from "react-icons/bs";
import ReviewRating from "./ReviewRating";

export default function UserRating({reviews}: { reviews: UserReview[] }) {
    // const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    const averageRating = 4.5;


    return (

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
            <ReviewRating rating={averageRating}/>
            <span className="text-theme-text dark:text-theme-text-dark text-xs underline">
                ({reviews.length} reviews)
            </span>
        </div>

    );
};