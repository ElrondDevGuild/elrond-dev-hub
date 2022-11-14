import { HiUserCircle } from 'react-icons/hi';

import { classNames } from '../../utils/presentation';

type Size = "sm" | "md" | "lg" | "xl";
export default function ProfileImage({ avatarUrl, size = "md" }: { avatarUrl: string | null; size?: Size }) {
  const sizeClass = getClassSizes(size);
  if (!avatarUrl) {
    return <HiUserCircle className={classNames(sizeClass, "text-primary dark:text-primary-dark")} />;
  }

  return <img src={avatarUrl} className={classNames(sizeClass, "rounded-full")} alt="profile picture" />;
}

const getPxSize = (size: Size) => {
  switch (size) {
    case "sm":
      return 16;
    case "md":
      return 32;
    case "lg":
      return 44;
    default:
      return 64;
  }
};
const getClassSizes = (size: Size) => {
  switch (size) {
    case "sm":
      return "w-[16px] h-[16px]";
    case "md":
      return "w-[32px] h-[32px]";
    case "lg":
      return "w-[44px] h-[44px]";
    default:
      return "w-[64px] h-[64px]";
  }
};
