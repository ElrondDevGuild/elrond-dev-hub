import {Bounty} from "../../types/supabase";
import {GoPrimitiveDot} from "react-icons/go";
import {classNames} from "../../utils/presentation";

const formatStatus = (status: string): string => {
    return status.replace("_", " ")
}
const statusColor = (status: string) => {
    return "text-primary dark:text-primary-dark";
}
export default function BountyStatus({bounty}: { bounty: Bounty }) {
    const color = statusColor(bounty.status);
    return (
        <div className={classNames(
            "uppercase flex items-center", color
        )}>
            <GoPrimitiveDot className={classNames("mr-1 text-lg", color)}/>
            {formatStatus(bounty.status)}
        </div>
    );
}