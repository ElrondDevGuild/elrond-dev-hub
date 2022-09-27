import {UserReview} from "../types/supabase";
import {BsStarFill as StarIcon} from "react-icons/bs";

export default function UserRating({reviews}: { reviews: UserReview[] }) {
    // const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    const averageRating = 4.5;
    const stars = [];
    for (let i = 0; i < 5; i++) {
        if (i + 1 < averageRating) {
            stars.push(<StarIcon key={i} className="h-4 w-4 text-primary dark:text-primary-dark"/>);
        } else {
            stars.push(<StarIcon key={i} className="h-4 w-4 text-theme-text"/>);
        }
    }

    return (

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
            <div className="flex items-center space-x-1">
                {stars}
            </div>
            <span className="text-theme-text dark:text-theme-text-dark text-xs underline">
                ({reviews.length} reviews)
            </span>
        </div>

    );
};