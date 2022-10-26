import {BountyApplication} from "../../../types/supabase";

export default function ApplicationStatusInfo({application}: { application: BountyApplication }) {
    if (application.approval_status === "accepted") {
        switch (application.work_status) {
            case "pending":
                return <span className="text-primary-dark">Accepted</span>;
            case "completed":
                return <span className="text-primary-dark">Work Completed</span>;
            case "in_progress":
                return <span className="text-primary-dark">In Progress</span>;
        }
    }

    if (application.approval_status === "rejected") {
        return <span className="text-red-500">Rejected</span>
    }

    return null;
};