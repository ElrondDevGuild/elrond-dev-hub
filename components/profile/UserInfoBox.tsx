import Link from 'next/link';
import { useRouter } from 'next/router';

import { useAuth } from '../../hooks/useAuth';
import { getUserHandle } from '../../utils/profile';
import { authPath, profilePath } from '../../utils/routes';
import DropDown, { DropdownOption } from '../shared/DropDown';
import ProfileImage from './ProfileImage';

export default function UserInfoBox() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const menuOptions: DropdownOption[] = [
    {
      label: "My Profile",
      onClick: async () => {
        await router.push(`/profile/${user?.id}`);
      },
    },
    {
      label: "Settings",
      onClick: async () => {
        await router.push("/profile/settings");
      },
    },
    {
      label: "Sign out",
      onClick: async () => {
        logout();
        await router.push("/");
      },
    },
  ];

  if (!user) {
    return (
      <Link href={authPath}>
        <div className="bg-primary dark:bg-primary-dark text-white py-2 px-6 text-xs rounded-md cursor-pointer hover:opacity-90">
          Connect Wallet
        </div>
      </Link>
    );
  }

  return (
    <div className="h-20 flex items-center space-x-3">
      <button className="flex items-center overflow-hidden" onClick={() => router.push(`${profilePath}/${user.id}`)}>
        <ProfileImage avatarUrl={user.avatar_url} size="lg" />
        <div className="flex flex-col items-start ml-2 ">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-theme-title dark:text-theme-title-dark font-semibold">{user.name}</span>
            {user.verified && <img src="/verified_icon.svg" className="mr-1" />}
          </div>
          <span className="text-xs text-theme-text dark:text-theme-text-dark text-clip overflow-hidden">
            {getUserHandle(user)}
          </span>
        </div>
      </button>
      <DropDown options={menuOptions} positionY={"bottom"} />
    </div>
  );
}
