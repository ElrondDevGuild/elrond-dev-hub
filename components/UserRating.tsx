import {UserReview} from "../types/supabase";
import {BsStarFill as StarIcon} from "react-icons/bs";
import ReviewRating from "./ReviewRating";
import Link from "next/link";
import {profilePath} from "../utils/routes";

export default function UserRating({userId, reviews}: { userId: string, reviews: UserReview[] }) {
    // const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    const averageRating = 4.5;


    return (

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
            <ReviewRating rating={averageRating}/>
            <Link href={`${profilePath}/${userId}`}>
                <a className="text-theme-text dark:text-theme-text-dark text-xs underline">
                    ({reviews.length} reviews)
                </a>
            </Link>
        </div>

    );
};