import {Bounty, BountyApplication, User} from "../../types/supabase";
import {useState} from "react";
import Tabs from "../tabs/Tabs";
import Tab from "../tabs/Tab";
import UserBountyList from "./UserBountyList";

export default function UserBounties({user}: { user: User }) {

    const [applications, setApplications] = useState<BountyApplication[]>([]);

    return (
        <Tabs>
            <Tab label="Bounties">
                <UserBountyList user={user}/>
            </Tab>
            <Tab label="Applications">

            </Tab>
        </Tabs>
    );

}