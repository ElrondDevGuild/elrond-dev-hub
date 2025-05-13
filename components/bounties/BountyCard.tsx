import React, { useState } from "react";
import { BsCheck2Circle, BsLightningCharge, BsExclamationTriangle, BsClock, BsTag } from "react-icons/bs";
import { FiDollarSign, FiCalendar, FiExternalLink, FiUsers, FiUser, FiInfo } from "react-icons/fi";
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

interface BountyCardProps {
  bounty: PeerMeBounty;
  viewMode?: "grid" | "list";
}

// Define an interface for the deadline return type
interface DeadlineInfo {
  text: string;
  isEnded: boolean;
  urgent: boolean;
  hasDeadline: boolean; // Flag to indicate if there is a deadline
}

const BountyCard: React.FC<BountyCardProps> = ({ bounty, viewMode = "grid" }) => {
  const getStatusTag = () => {
    let icon, text, colorClasses;

    switch (bounty.status) {
      case "open":
        icon = <BsCheck2Circle className="mr-1.5" />;
        text = "Open";
        colorClasses = "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800";
        break;
      case "in_progress":
        icon = <BsLightningCharge className="mr-1.5" />;
        text = "In Progress";
        colorClasses = "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
        break;
      case "evaluating":
        icon = <BsClock className="mr-1.5" />;
        text = "Evaluating";
        colorClasses = "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
        break;
      case "completed":
        icon = <BsCheck2Circle className="mr-1.5" />; 
        text = "Completed";
        colorClasses = "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800";
        break;
      case "closed":
      default:
        icon = <BsExclamationTriangle className="mr-1.5" />;
        text = "Closed";
        colorClasses = "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800";
        break;
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md ${colorClasses}`}>
        {icon} {text}
      </span>
    );
  };

  const formatDeadline = (dateStr: string | null): DeadlineInfo => {
    if (!dateStr) {
      return { 
        text: "No deadline", 
        isEnded: false, 
        urgent: false,
        hasDeadline: false
      };
    }
    
    const date = new Date(dateStr);
    const now = new Date();
    
    // Check if deadline has passed
    if (date < now || bounty.hasDeadlineEnded) {
      return { 
        text: `Ended: ${date.toLocaleDateString()}`, 
        isEnded: true, 
        urgent: false,
        hasDeadline: true
      };
    }
    
    // Calculate days remaining
    const diffTime = Math.abs(date.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return { 
        text: "Ends today!", 
        isEnded: false, 
        urgent: true,
        hasDeadline: true
      };
    } else if (diffDays === 1) {
      return { 
        text: "Ends tomorrow", 
        isEnded: false, 
        urgent: true,
        hasDeadline: true
      };
    } else if (diffDays <= 3) {
      return { 
        text: `${diffDays} days left`, 
        isEnded: false, 
        urgent: true,
        hasDeadline: true
      };
    } else {
      return { 
        text: `${diffDays} days left`, 
        isEnded: false, 
        urgent: false,
        hasDeadline: true
      };
    }
  };

  // Format payment amount
  const formatPaymentAmount = () => {
    if (!bounty.payments || bounty.payments.length === 0) return "Not specified";
    
    const payment = bounty.payments[0]; // Get first payment
    const amount = parseInt(payment.amount) / Math.pow(10, payment.tokenDecimals);
    
    return `${amount} ${payment.tokenName}`;
  };

  const creatorName = bounty.entity?.name || "Unknown Creator";
  const createdAt = new Date(bounty.createdAt).toLocaleDateString();
  const deadline = bounty.deadlineAt ? formatDeadline(bounty.deadlineAt) : formatDeadline(null);

  // List view layout
  if (viewMode === "list") {
    return (
      <div className="relative bg-white dark:bg-secondary-dark rounded-xl overflow-hidden shadow-sm border border-theme-border dark:border-theme-border-dark">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {getStatusTag()}
              
              {bounty.competition && (
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  <FiUsers className="mr-1.5" /> Competition
                </span>
              )}
              
              {deadline.hasDeadline && deadline.urgent && !deadline.isEnded && (
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                  <FiCalendar className="mr-1.5" /> {deadline.text}
                </span>
              )}
            </div>
            
            <Link href={`/bounties/${bounty.id}`}>
              <a className="block cursor-pointer">
                <h3 className="text-base font-semibold text-theme-title dark:text-theme-title-dark mb-2 hover:text-primary dark:hover:text-primary-dark transition-colors">
                  {bounty.title}
                </h3>
              </a>
            </Link>
            
            <div className="flex flex-wrap items-center text-xs text-theme-text/70 dark:text-theme-text-dark/70 mb-2 gap-x-3 gap-y-1">
              <span className="flex items-center">
                <FiDollarSign className="mr-1 flex-shrink-0" />
                {formatPaymentAmount()}
              </span>
              
              {deadline.hasDeadline && !deadline.urgent && (
                <span className={`flex items-center ${deadline.isEnded ? "text-red-500 dark:text-red-400" : ""}`}>
                  <FiCalendar className="mr-1 flex-shrink-0" />
                  {deadline.text}
                </span>
              )}
            </div>
            
            <p className="text-xs text-theme-text/80 dark:text-theme-text-dark/80 mb-3 line-clamp-2">
              {bounty.description.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
            </p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <div className="flex items-center">
                 <FiUsers className="mr-1.5 text-theme-text/70 dark:text-theme-text-dark/70" />
                <span className="text-theme-text dark:text-theme-text-dark">
                  {creatorName}
                  {bounty.entity?.verified && (
                    <span className="ml-1 text-green-500 dark:text-green-400">✓</span>
                  )}
                </span>
              </div>
              
              {bounty.tags && bounty.tags.length > 0 && (
                <div className="flex items-center">
                  <BsTag className="mr-1.5 text-theme-text/70 dark:text-theme-text-dark/70" />
                  <div className="flex flex-wrap gap-1">
                    {bounty.tags.slice(0, 3).map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-md border border-gray-200 dark:border-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                    {bounty.tags.length > 3 && (
                      <span className="text-xs text-theme-text/60 dark:text-theme-text-dark/60">
                        +{bounty.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="ml-auto text-xs text-theme-text/50 dark:text-theme-text-dark/50">
                Posted: {createdAt}
              </div>
            </div>
          </div>
          
          <div className="flex sm:flex-col sm:justify-center sm:items-end gap-2 sm:min-w-[120px] mt-2 sm:mt-0">
            <Link href={`/bounties/${bounty.id}`}>
              <a className="py-1.5 px-3 text-xs font-medium rounded-md flex items-center justify-center transition-colors w-full sm:w-auto bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark hover:bg-primary/20 dark:hover:bg-primary-dark/20">
                <FiInfo className="mr-1.5" />
                View Details
              </a>
            </Link>
            
            <a 
              href={bounty.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`py-1.5 px-3 text-xs font-medium rounded-md flex items-center justify-center transition-colors w-full sm:w-auto ${
                bounty.status === "open"
                  ? "bg-primary dark:bg-primary-dark text-white hover:bg-primary-dark dark:hover:bg-primary"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <FiExternalLink className="mr-1.5" />
              {bounty.status === "open" ? "Apply" : "View"}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Grid view layout (default)
  return (
    <div className="relative bg-white dark:bg-secondary-dark rounded-xl overflow-hidden shadow-sm border border-theme-border dark:border-theme-border-dark h-full flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {getStatusTag()}
          
          {bounty.competition && (
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <FiUsers className="mr-1.5" /> Competition
            </span>
          )}
          
          {deadline.hasDeadline && deadline.urgent && !deadline.isEnded && (
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
              <FiCalendar className="mr-1.5" /> {deadline.text}
            </span>
          )}
        </div>
      
        <Link href={`/bounties/${bounty.id}`}>
          <a className="block mb-2 cursor-pointer">
            <h3 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark line-clamp-2 hover:text-primary dark:hover:text-primary-dark transition-colors">
              {bounty.title}
            </h3>
          </a>
        </Link>
        
        <div className="flex flex-wrap items-center text-xs text-theme-text/70 dark:text-theme-text-dark/70 mb-3 gap-x-3 gap-y-1">
          <span className="flex items-center">
            <FiDollarSign className="mr-1" />
            {formatPaymentAmount()}
          </span>
          
          {deadline.hasDeadline && !deadline.urgent && (
            <span className={`flex items-center ${deadline.isEnded ? "text-red-500 dark:text-red-400" : ""}`}>
              <FiCalendar className="mr-1" />
              {deadline.text}
            </span>
          )}
        </div>
        
        <p className="text-sm text-theme-text/80 dark:text-theme-text-dark/80 mb-4 line-clamp-3">
          {bounty.description.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-start">
            <FiUsers className="mr-2 mt-0.5 text-sm text-theme-text/70 dark:text-theme-text-dark/70 flex-shrink-0" />
            <span className="text-sm text-theme-text dark:text-theme-text-dark">
              {creatorName}
              {bounty.entity?.verified && (
                <span className="ml-1 text-green-500 dark:text-green-400">✓</span>
              )}
            </span>
          </div>
          
          <div className="flex items-center">
            <BsClock className="mr-2 text-sm text-theme-text/70 dark:text-theme-text-dark/70 flex-shrink-0" />
            <span className="text-xs text-theme-text/50 dark:text-theme-text-dark/50">
              Posted: {createdAt}
            </span>
          </div>
          
          {bounty.tags && bounty.tags.length > 0 && (
             <div className="flex items-start">
              <BsTag className="mr-2 mt-0.5 text-sm text-theme-text/70 dark:text-theme-text-dark/70 flex-shrink-0" />
              <div className="flex flex-wrap gap-1.5">
                {bounty.tags.slice(0, 4).map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md text-xs border border-gray-200 dark:border-gray-700"
                  >
                    {tag}
                  </span>
                ))}
                {bounty.tags.length > 4 && (
                  <span className="text-xs text-theme-text/60 dark:text-theme-text-dark/60">
                    +{bounty.tags.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-5 border-t border-theme-border dark:border-theme-border-dark mt-auto">
        <div className="flex flex-col gap-2">
          <Link href={`/bounties/${bounty.id}`}>
            <a className="w-full py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center transition-colors cursor-pointer bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark hover:bg-primary/20 dark:hover:bg-primary-dark/20">
              <FiInfo className="mr-2" />
              View Details
            </a>
          </Link>
          
          <a 
            href={bounty.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`w-full py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center transition-colors ${
              bounty.status === "open" 
                ? "bg-primary dark:bg-primary-dark text-white hover:bg-primary-dark dark:hover:bg-primary"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <FiExternalLink className="mr-2" />
            {bounty.status === "open" ? "Apply on PeerMe" : "View on PeerMe"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default BountyCard; 