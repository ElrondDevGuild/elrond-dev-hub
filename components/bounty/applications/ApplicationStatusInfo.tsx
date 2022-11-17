import { BountyApplication } from '../../../types/supabase';

export default function ApplicationStatusInfo({ application }: { application: BountyApplication }) {
  if (application.approval_status === "accepted") {
    return <span className="text-primary-dark text-sm">Accepted</span>;
  }

  if (application.approval_status === "rejected") {
    return <span className="text-red-500 text-sm">Rejected</span>;
  }

  return null;
}
