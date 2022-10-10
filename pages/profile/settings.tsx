import RequiresAuth from "../../components/RequiresAuth";
import Layout from "../../components/Layout";
import {useEffect, useMemo, useState} from "react";
import {FormProvider, useForm} from 'react-hook-form';
import Input from "../../components/shared/form/Input";
import Textarea from "../../components/shared/form/Textarea";
import {SocialPlatform, UserSocialLink} from "../../types/supabase";
import {useAuth} from "../../hooks/useAuth";
import ModalAddSocialLink from "../../components/profile/ModalAddSocialLink";
import {FaTwitter, FaLinkedin, FaDiscord, FaTelegram, FaGithub} from "react-icons/fa"
import Button from "../../components/shared/Button";
import {api, getApiErrorMessage} from "../../utils/api";
import {useRouter} from "next/router";
import {profilePath} from "../../utils/routes";

type FormValues = {
    name: string;
    description: string;
};

const icons = {
    twitter: <FaTwitter className="w-5 h-5"/>,
    linkedin: <FaLinkedin className="w-5 h-5"/>,
    github: <FaGithub className="w-5 h-5"/>,
    discord: <FaDiscord className="w-5 h-5"/>,
    telegram: <FaTelegram className="w-5 h-5"/>,
};
const platforms = [
    {name: 'Twitter', id: 'twitter', icon: <FaTwitter/>},
    {name: 'LinkedId', id: 'linkedin', icon: <FaLinkedin/>},
    {name: 'Github', id: 'github', icon: <FaGithub/>},
    {name: 'Discord', id: 'discord', icon: <FaDiscord/>},
    {name: 'Telegram', id: 'telegram', icon: <FaTelegram/>},

];

export default function Profile() {
    const formMethods = useForm<FormValues>();
    const {handleSubmit, setValue} = formMethods;
    const [submitting, setSubmitting] = useState(false);
    const [socialLinks, setSocialLinks] = useState<Partial<UserSocialLink>[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const {user, setUser} = useAuth();
    const router = useRouter();
    const remainingPlatforms = useMemo(() => {
        const usedPlatforms = socialLinks.map(link => link.platform);

        // @ts-ignore
        return platforms.filter(platform => !usedPlatforms.includes(platform.id));
    }, [socialLinks]);

    const updateProfile = async (values: FormValues) => {
        setSubmitting(true);
        try {
            const {data} = await api.put('/user', {
                ...values,
                social_links: socialLinks
            });
            setUser(data);
            // await router.push(profilePath);
        }catch (e) {
            alert(getApiErrorMessage(e));
        } finally {
            setSubmitting(false);
        }

    };

    const addSocialLink = (
        {
            platform,
            username
        }: { platform: SocialPlatform, username: string }
    ) => {
        setSocialLinks([...socialLinks, {platform, username}]);
    };

    const removeSocialLink = (platform: SocialPlatform) => {
        setSocialLinks(socialLinks.filter(link => link.platform !== platform));
    }

    useEffect(() => {
        if (!user) { return;}
        setValue("name", user.name || "");
        setValue("description", user.description || "");
        setSocialLinks(user.social_links || []);
    }, [user]);


    return (
        <Layout hideRightBar={true}>
            <RequiresAuth>
                <div className="lg:px-16 text-theme-text dark:text-theme-text-dark rounded-md">
                    <div className="flex flex-col">
                        <h1 className="font-semibold text-4xl text-theme-title dark:text-theme-title-dark mb-4">
                            My Profile
                        </h1>
                        <p className="max-w-xl">
                            Setup your profile and account settings. Write a short bio about
                            yourself, so people can get to know you.
                        </p>
                    </div>

                    <div className="mt-10">
                        <h2 className="font-semibold text-xl text-theme-title dark:text-theme-title-dark mb-6">
                            Bounty Details
                        </h2>
                        <FormProvider {...formMethods}>
                            <form
                                onSubmit={handleSubmit(updateProfile)}
                                className="flex flex-col space-y-8 w-full md:w-1/2"
                            >
                                <Input
                                    label="Name*"
                                    name="name"
                                    placeholder=""
                                    type="text"
                                    options={{required: true}}
                                />
                                <Textarea
                                    label="Description*"
                                    name="description"
                                    placeholder=""
                                    options={{required: true}}
                                />
                                <div className="flex flex-col items-start">
                                     <span
                                         className="block font-semibold text-xs text-primary dark:text-primary-dark uppercase mb-2"
                                     >
                                         Social links
                                    </span>
                                    <p className="text-sm mb-4">
                                        You must set at least your Twitter or LinkedIn handle and
                                        one of Telegram or Discord accounts.
                                    </p>
                                    <div className="flex flex-col items-start my-2 space-y-4">
                                        {socialLinks.map((socialLink) => (
                                            <div
                                                className="flex items-center"
                                                key={socialLink.platform}
                                            >
                                                {icons[socialLink.platform as SocialPlatform]}
                                                <span
                                                    className="ml-2 mr-6 text-lg">{socialLink.username}</span>
                                                <button
                                                    className="text-sm text-red-500"
                                                    type="button"
                                                    onClick={() => {
                                                        removeSocialLink(socialLink.platform as SocialPlatform
                                                        )
                                                    }}
                                                >
                                                    remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        className="text-primary dark:text-primary-dark hover:underline"
                                        type="button"
                                        onClick={() => {setOpenModal(true)}}
                                    >
                                        + Add Social link
                                    </button>
                                </div>
                                <div>
                                    <Button label={submitting ? "Loading..." : "Submit"}
                                            disabled={submitting}/>
                                </div>
                            </form>
                        </FormProvider>
                        <ModalAddSocialLink
                            open={openModal}
                            setOpen={setOpenModal}
                            onSubmit={addSocialLink}
                            platforms={remainingPlatforms}
                        />
                    </div>
                </div>
            </RequiresAuth>
        </Layout>
    );
};