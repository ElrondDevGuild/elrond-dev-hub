import {Bounty, BountyApplication, User} from "../../types/supabase";
import {useState} from "react";
import Tabs from "../tabs/Tabs";
import Tab from "../tabs/Tab";
import UserBountyList from "./UserBountyList";
import UserApplicationsList from "./UserApplicationsList";
import BountyReviewsList from "./reviews/BountyReviewsList";

export default function UserBounties({user}: { user: User }) {


    return (
        <Tabs>
            <Tab label="Bounties">
                <UserBountyList user={user}/>
                <BountyReviewsList userId={user.id}/>
            </Tab>
            <Tab label="Applications">
                <UserApplicationsList user={user}/>
            </Tab>
        </Tabs>
    );

}