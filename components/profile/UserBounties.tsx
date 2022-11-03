import {Bounty, BountyApplication, User, UserRating, UserRatings} from "../../types/supabase";
import {useEffect, useMemo, useState} from "react";
import Tabs from "../tabs/Tabs";
import Tab from "../tabs/Tab";
import UserBountyList from "./UserBountyList";
import UserApplicationsList from "./UserApplicationsList";
import ReviewsList from "./reviews/ReviewsList";
import {api} from "../../utils/api";
import UserRatingComponent from "../UserRating";

const BOUNTIES_TAB = "Bounties";
const APPLICATIONS_TAB = "Applications";

export default function UserBounties({user}: { user: User }) {
    const [ratings, setRatings] = useState<UserRatings | null>(null);
    const [currentTab, setCurrentTab] = useState<string>();
    const currentRating: UserRating = useMemo(() => {
        if (!currentTab || !ratings) {
            return {
                rating: 0,
                nbReviews: 0,
            };
        }
        if (currentTab === BOUNTIES_TAB) {
            return ratings.bounties;
        }

        return ratings.applications;
    }, [currentTab, ratings]);

    const loadRating = async () => {
        try {
            const {data} = await api.get(`user/${user.id}/rating`);
            setRatings(data);
        } catch (e) {
            setRatings(null);
        }
    };

    const onTabChange = (tab: string) => {
        setCurrentTab(tab);
    };

    useEffect(() => {
        loadRating();
    }, [user]);

    return (
        <div className="">
            <div className="flex items-center justify-between mt-10">
                <h3 className="text-theme-text dark:text-theme-text-dark font-semibold">
                    Bounties
                </h3>
                <UserRatingComponent userId={user.id} rating={currentRating}/>
            </div>
            <Tabs onChange={onTabChange}>
                <Tab label={BOUNTIES_TAB}>
                    <UserBountyList user={user}/>
                    <ReviewsList userId={user.id} type={"bounty"}/>
                </Tab>
                <Tab label={APPLICATIONS_TAB}>
                    <UserApplicationsList user={user}/>
                    <ReviewsList userId={user.id} type={"application"}/>
                </Tab>
            </Tabs>
        </div>
    );

}