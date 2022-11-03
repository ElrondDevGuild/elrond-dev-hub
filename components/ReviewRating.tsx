import {BsStarFill as StarIcon} from "react-icons/bs";

export default function ReviewRating({rating}: { rating: number }) {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars.push(<StarIcon key={i} className="h-4 w-4 text-primary dark:text-primary-dark"/>);
        } else {
            stars.push(<StarIcon key={i} className="h-4 w-4 text-theme-text"/>);
        }
    }

    return (
        <div className="flex items-center space-x-1">
            {stars}
        </div>
    );
};