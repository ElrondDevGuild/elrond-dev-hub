import RequiresAuth from "../../components/RequiresAuth";
import Layout from "../../components/Layout";
import ProfileImage from "../../components/profile/ProfileImage";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {api} from "../../utils/api";
import {User, UserReview} from "../../types/supabase";
import UserRating from "../../components/UserRating";
import {FaDiscord, FaGithub, FaLinkedin, FaTelegram, FaTwitter} from "react-icons/fa";


const platforms = {
    twitter: {
        url: "https://twitter.com/",
        icon: <FaTwitter className="w-4 h-4"/>
    },
    linkedin: {
        url: "https://linkedin.com/in/",
        icon: <FaLinkedin className="w-4 h-4"/>
    },
    github: {
        url: "https://github.com/",
        icon: <FaGithub className="w-4 h-4"/>
    },
    discord: {
        url: "https://discordapp.com/users/",
        icon: <FaDiscord className="w-4 h-4"/>
    },
    telegram: {
        url: "https://t.me/",
        icon: <FaTelegram className="w-5 h-5"/>
    },
};

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [reviews, setReviews] = useState<UserReview[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const getUser = async (userId: string) => {
        setLoading(true);
        const {data} = await api.get(`/user/${userId}`);
        setUser(data);
        setLoading(false);
    }
    useEffect(() => {
        const {id} = router.query;
        if (!id) {return;}
        getUser(id as string);
    }, [router.isReady, router.query]);

    return (
        <Layout hideRightBar={true}>
            <RequiresAuth>
                {
                    user && <div className="flex flex-col w-full pl-6">
                        <div className="flex items-center">
                            <ProfileImage user={user} size="lg"/>
                            <div className="flex flex-col ml-2 space-y-1">
                                <h1 className="text-theme-title dark:text-theme-title-dark font-semibold">{user.name}</h1>
                                <UserRating reviews={reviews}/>
                                <div className="flex items-center space-x-2">
                                    {user.social_links?.map((link,) => {
                                        return <PlatformIcon
                                            key={link.platform}
                                            platform={link.platform}
                                            username={link.username}
                                        />
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </RequiresAuth>
        </Layout>
    );
};

function PlatformIcon(
    {
        platform,
        username
    }: { platform: keyof typeof platforms, username: string }
) {
    const platformData = platforms[platform];

    return (
        <a
            href={platformData.url + username}
            target="_blank"
            rel="noreferrer"
            className="text-primary dark:text-primary-dark"
        >
            {platformData.icon}
        </a>
    );
}