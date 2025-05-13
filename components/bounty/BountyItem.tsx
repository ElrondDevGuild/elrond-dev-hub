import { AiFillClockCircle } from "react-icons/ai";
import { BsFillPersonFill, BsTag, BsCalendarCheck } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { FiDollarSign, FiUser, FiUsers, FiExternalLink, FiInfo } from "react-icons/fi";
import Link from "next/link";

// Interface for the PeerMe bounty data structure based on actual API response
interface PeerMeBounty {
  id: string;
  chainId: number;
  entity: {
    id: string;
    name: string;
    slug: string;
    address: string;
    avatarUrl: string;
    description: string;
    verified: boolean;
  };
  title: string;
  description: string;
  deadlineAt: string | null;
  hasDeadlineEnded: boolean;
  competition: boolean;
  payments: Array<{
    tokenId: string;
    tokenNonce: string;
    tokenDecimals: number;
    tokenLogo: string;
    tokenName: string;
    amount: string;
  }>;
  target: {
    tokenId: string;
    tokenNonce: string;
    tokenDecimals: number;
    tokenLogo: string;
    tokenName: string;
    amount: string;
  };
  status: string;
  evaluating: boolean;
  private: boolean;
  createdAt: string;
  url: string;
  tags?: string[]; // Keeping this for compatibility, though not in API directly
}

interface BountyItemProps {
  bounty: PeerMeBounty;
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case "open":
      return { text: "Open", icon: <GoDotFill className="text-green-500 dark:text-green-400 mr-1 text-lg" />, color: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800" };
    case "in_progress":
      return { text: "In Progress", icon: <GoDotFill className="text-blue-500 dark:text-blue-400 mr-1 text-lg" />, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800" };
    case "evaluating":
      return { text: "Evaluating", icon: <GoDotFill className="text-yellow-500 dark:text-yellow-400 mr-1 text-lg" />, color: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800" };
    case "closed":
      return { text: "Closed", icon: <GoDotFill className="text-red-500 dark:text-red-400 mr-1 text-lg" />, color: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800" };
    case "completed":
      return { text: "Completed", icon: <GoDotFill className="text-purple-500 dark:text-purple-400 mr-1 text-lg" />, color: "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800" };
    default:
      return { text: status, icon: null, color: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-700" };
  }
};

const timeAgo = (dateString?: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
};

// Format payment amount
const formatPaymentAmount = (bounty: PeerMeBounty) => {
  if (!bounty.payments || bounty.payments.length === 0) return null;
  
  const payment = bounty.payments[0]; // Get first payment
  const amount = parseInt(payment.amount) / Math.pow(10, payment.tokenDecimals);
  
  return { amount, tokenName: payment.tokenName, tokenLogo: payment.tokenLogo };
};

// Format deadline
const formatDeadline = (dateStr: string | null, hasEnded: boolean) => {
  if (!dateStr) return null;
  
  const date = new Date(dateStr);
  const now = new Date();
  
  if (hasEnded || date < now) {
    return { text: `Ended ${date.toLocaleDateString()}`, isEnded: true };
  }
  
  // Calculate days remaining
  const diffTime = Math.abs(date.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return { text: "Ends today!", isEnded: false, urgent: true };
  } else if (diffDays === 1) {
    return { text: "Ends tomorrow", isEnded: false, urgent: true };
  } else if (diffDays <= 3) {
    return { text: `${diffDays} days left`, isEnded: false, urgent: true };
  } else {
    return { text: `Deadline: ${date.toLocaleDateString()}`, isEnded: false };
  }
};

export default function BountyItem({ bounty }: BountyItemProps) {
  const statusInfo = getStatusInfo(bounty.status);
  const creatorName = bounty.entity?.name || "Unknown Creator";
  const publishedDate = timeAgo(bounty.createdAt);
  const payment = formatPaymentAmount(bounty);
  const deadline = bounty.deadlineAt ? formatDeadline(bounty.deadlineAt, bounty.hasDeadlineEnded) : null;

  return (
    <div className="flex flex-col bg-white dark:bg-secondary-dark-lighter border border-theme-border dark:border-theme-border-dark rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between py-5 px-6 border-b border-theme-border dark:border-theme-border-dark flex-col md:flex-row md:items-center">
        <div className="text-theme-title dark:text-theme-title-dark font-semibold text-xl md:text-2xl mb-2 md:mb-0 md:order-first order-last max-w-xl lg:max-w-2xl truncate">
          <Link href={`/bounties/${bounty.id}`}>
            <a className="hover:text-primary dark:hover:text-primary-dark transition-colors">
                {bounty.title}
            </a>
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.icon} {statusInfo.text}
          </span>
          
          {bounty.competition && (
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <FiUsers className="mr-1.5" /> Competition
            </span>
          )}
          
          {payment && (
            <div className="font-medium text-sm">
              <div className="bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark px-3 py-1 rounded-md inline-flex items-center">
                <FiDollarSign className="mr-1"/> {payment.amount} {payment.tokenName}
              </div>
            </div>
          )}
          
          {deadline && deadline.urgent && !deadline.isEnded && (
            <div className="font-medium text-xs">
              <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 px-3 py-1 rounded-md inline-flex items-center">
                <BsCalendarCheck className="mr-1.5"/> {deadline.text}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <FiUsers className="text-theme-text/70 dark:text-theme-text-dark/70 mr-1.5" />
              <span className="text-sm text-theme-text dark:text-theme-text-dark">
                {creatorName}
                {bounty.entity?.verified && (
                  <span className="ml-1 text-green-500 dark:text-green-400">✓</span>
                )}
              </span>
            </div>
            
            {publishedDate && (
              <div className="flex items-center text-xs text-theme-text/60 dark:text-theme-text-dark/60">
                <span className="mx-1.5">•</span>
                <AiFillClockCircle className="mr-1" /> {publishedDate}
              </div>
            )}
            
            {deadline && !deadline.urgent && (
              <div className={`flex items-center text-xs ${deadline.isEnded ? "text-red-500 dark:text-red-400" : "text-theme-text/60 dark:text-theme-text-dark/60"}`}>
                <span className="mx-1.5">•</span>
                <BsCalendarCheck className="mr-1"/> {deadline.text}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Link href={`/bounties/${bounty.id}`}>
              <a className="text-xs font-medium px-3 py-1.5 rounded-md bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark hover:bg-primary/20 dark:hover:bg-primary-dark/20 flex items-center">
                <FiInfo className="mr-1.5 w-3 h-3"/> Details
              </a>
            </Link>
            
            <a 
              href={bounty.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`text-xs font-medium px-3 py-1.5 rounded-md flex items-center ${
                bounty.status === "open" 
                  ? "bg-primary dark:bg-primary-dark text-white hover:bg-primary-dark dark:hover:bg-primary" 
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <FiExternalLink className="mr-1.5 w-3 h-3"/>
              {bounty.status === "open" ? "Apply" : "View"}
            </a>
          </div>
        </div>
        
        {bounty.tags && bounty.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {bounty.tags.slice(0, 6).map((tag, idx) => (
              <span 
                key={idx} 
                className="px-2 py-0.5 text-xs rounded-md bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              >
                {tag}
              </span>
            ))}
            {bounty.tags.length > 6 && (
              <span className="text-xs text-theme-text/60 dark:text-theme-text-dark/60 px-1">
                +{bounty.tags.length - 6} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
