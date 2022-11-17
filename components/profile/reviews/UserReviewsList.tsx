import Link from 'next/link';
import { useMemo, useState } from 'react';

import { UserReview } from '../../../types/supabase';
import { bountyPath, profilePath } from '../../../utils/routes';
import ReviewRating from '../../ReviewRating';
import ProfileImage from '../ProfileImage';

const PER_PAGE = 4;
export default function UserReviewsList({ reviews }: { reviews: UserReview[] }) {
  const [index, setIndex] = useState(0);
  const currentReviews = useMemo(() => {
    return reviews.slice(index, index + PER_PAGE);
  }, [reviews, index]);
  const onNext = () => {
    setIndex((prevState) => prevState + PER_PAGE);
  };
  const onPrevious = () => {
    setIndex((prevState) => prevState - PER_PAGE);
  };
  const hasNext = useMemo(() => {
    return index + PER_PAGE < reviews.length;
  }, [reviews, index]);

  const hasPrevious = useMemo(() => {
    return index - PER_PAGE >= 0;
  }, [reviews, index]);

  return (
    <div className="w-full">
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-5">
        {currentReviews.map((review: UserReview) => (
          <li
            key={review.id}
            className="col-span-1 flex flex-col items-start rounded-lg bg-white dark:bg-secondary-dark-lighter border-theme-border dark:border-theme-border-dark p-4"
          >
            <div className="flex items-center space-x-2 text-sm mb-1 w-full font-semibold">
              <span className="text-primary dark:text-primary-dark">BOUNTY:</span>
              <Link href={bountyPath(review.bounty!.id)}>
                <a className="text-secondary-dark dark:text-secondary underline truncate">{review.bounty?.title}</a>
              </Link>
            </div>
            <ReviewRating rating={review.rating} />
            <div className="flex flex-col flex-grow mt-3">
              <p className="text-theme-text dark:text-theme-text-dark">{review.review}</p>
            </div>
            <div className="flex items-center space-x-2 mt-3">
              <ProfileImage avatarUrl={review.reviewer.avatar_url} size="md" />
              <Link href={`${profilePath}/${review.reviewer_id}`}>
                <a className="text-theme-text dark:text-theme-text-dark underline">{review.reviewer.name}</a>
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-end space-x-2 w-full mt-2">
        {hasPrevious && (
          <button className="dark:text-secondary font-semibold hover:underline" onClick={onPrevious}>
            {"< Previous"}
          </button>
        )}
        {hasNext && (
          <button className="dark:text-secondary font-semibold hover:underline" onClick={onNext}>
            {"Next >"}
          </button>
        )}
      </div>
    </div>
  );
}
