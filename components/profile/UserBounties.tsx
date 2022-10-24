import {Bounty, BountyApplication, User} from "../../types/supabase";
import {useState} from "react";
import Tabs from "../tabs/Tabs";
import Tab from "../tabs/Tab";
import UserBountyList from "./UserBountyList";
import UserApplicationsList from "./UserApplicationsList";

export default function UserBounties({user}: { user: User }) {

    const [applications, setApplications] = useState<BountyApplication[]>([]);

    return (
        <Tabs>
            <Tab label="Bounties">
                <UserBountyList user={user}/>
            </Tab>
            <Tab label="Applications">
                <UserApplicationsList user={user}/>
            </Tab>
        </Tabs>
    );

}