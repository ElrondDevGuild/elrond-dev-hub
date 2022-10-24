import {Bounty, BountyApplication, User} from "../../types/supabase";
import {useState} from "react";
import Tabs from "../tabs/Tabs";
import Tab from "../tabs/Tab";
import UserBountyList from "./UserBountyList";
import UserApplicationsList from "./UserApplicationsList";
import ReviewsList from "./reviews/ReviewsList";

export default function UserBounties({user}: { user: User }) {


    return (
        <Tabs>
            <Tab label="Bounties">
                <UserBountyList user={user}/>
                <ReviewsList userId={user.id} type={"bounty"}/>
            </Tab>
            <Tab label="Applications">
                <UserApplicationsList user={user}/>
                <ReviewsList userId={user.id} type={"application"}/>
            </Tab>
        </Tabs>
    );

}