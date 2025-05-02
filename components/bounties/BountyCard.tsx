import React, { useState } from "react";
import { BsCheck2Circle, BsLightningCharge, BsExclamationTriangle } from "react-icons/bs";
import { FiClock, FiDollarSign, FiCalendar, FiExternalLink } from "react-icons/fi";
import ApplyForBounty from "../forms/ApplyForBounty";
import CategoryBadge from "../shared/CategoryBadge";
import Link from "next/link";

interface BountyCardProps {
  bounty: {
    id: string;
    title: string;
    description: string;
    status: string;
    bounty_amount: string | null;
    token_type?: string;
    estimated_duration: string;
    category: string;
    difficulty_level: string;
    company_name: string;
    company_website: string;
    skills_needed: string[];
    deadline: string | null;
  };
  viewMode?: "grid" | "list";
}

const BountyCard: React.FC<BountyCardProps> = ({ bounty, viewMode = "grid" }) => {
  const [showApplyForm, setShowApplyForm] = useState(false);

  const getStatusTag = () => {
    if (bounty.status === "Open") {
      return (
        <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full absolute top-3 right-3 z-10">
          <BsCheck2Circle className="mr-1" /> Open
        </div>
      );
    } else if (bounty.status === "Pending") {
      return (
        <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-medium px-2 py-1 rounded-full absolute top-3 right-3 z-10">
          <BsExclamationTriangle className="mr-1" /> Pending
        </div>
      );
    } else if (bounty.status === "Closed") {
      return (
        <div className="flex items-center bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium px-2 py-1 rounded-full absolute top-3 right-3 z-10">
          <BsExclamationTriangle className="mr-1" /> Closed
        </div>
      );
    }
    return null;
  };

  // Format deadline for display
  const formatDeadline = (dateStr: string | null) => {
    if (!dateStr) return "No deadline";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Determine if bounty is ready for applications
  const isApplicable = bounty.status === "Open";

  // List view layout
  if (viewMode === "list") {
    return (
      <div className="relative bg-white dark:bg-secondary-dark rounded-xl overflow-hidden shadow-sm border border-theme-border dark:border-theme-border-dark">
        {getStatusTag()}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <div className="mb-2">
              <CategoryBadge category={bounty.category} />
            </div>
            
            <Link href={`/bounties/${bounty.id}`}>
              <a className="block">
                <h3 className="text-base font-semibold text-theme-title dark:text-theme-title-dark mb-2 hover:text-primary dark:hover:text-primary-dark transition-colors">
                  {bounty.title}
                </h3>
              </a>
            </Link>
            
            <div className="flex flex-wrap items-center text-xs text-theme-text/70 dark:text-theme-text-dark/70 mb-2 gap-3">
              <span className="flex items-center">
                <FiDollarSign className="mr-1 flex-shrink-0" />
                {bounty.bounty_amount || "0"} {bounty.token_type || "EGLD"}
              </span>
              <span className="flex items-center">
                <FiClock className="mr-1 flex-shrink-0" />
                {bounty.estimated_duration}
              </span>
              {bounty.deadline && (
                <span className="flex items-center">
                  <FiCalendar className="mr-1 flex-shrink-0" />
                  {formatDeadline(bounty.deadline)}
                </span>
              )}
            </div>
            
            <p className="text-xs text-theme-text/80 dark:text-theme-text-dark/80 mb-3 line-clamp-2">
              {bounty.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <div className="flex items-center">
                <span className="font-medium text-theme-text/70 dark:text-theme-text-dark/70 mr-1">By:</span>
                <a 
                  href={bounty.company_website} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  {bounty.company_name}
                  <FiExternalLink className="ml-1 w-3 h-3" />
                </a>
              </div>
              
              <div className="flex items-center">
                <span className="font-medium text-theme-text/70 dark:text-theme-text-dark/70 mr-1">Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {bounty.skills_needed?.slice(0, 2).map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="bg-gray-100 dark:bg-gray-800 text-xs px-1.5 py-0.5 rounded-full text-theme-text dark:text-theme-text-dark"
                    >
                      {skill}
                    </span>
                  ))}
                  {bounty.skills_needed?.length > 2 && (
                    <span className="text-xs text-theme-text/60 dark:text-theme-text-dark/60">
                      +{bounty.skills_needed.length - 2}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="font-medium text-theme-text/70 dark:text-theme-text-dark/70 mr-1">Difficulty:</span>
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  bounty.difficulty_level === "Easy" 
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    : bounty.difficulty_level === "Medium" 
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                }`}>
                  {bounty.difficulty_level}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex sm:flex-col sm:justify-center sm:items-end gap-2 sm:min-w-[120px] mt-2 sm:mt-0">
            <Link href={`/bounties/${bounty.id}`}>
              <a className={`py-1.5 px-3 text-xs font-medium rounded-md flex items-center justify-center transition-colors w-full sm:w-auto ${
                isApplicable
                  ? "bg-primary dark:bg-primary-dark text-white hover:bg-primary-dark dark:hover:bg-primary"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}>
                {isApplicable && <BsLightningCharge className="mr-1.5" />}
                View Details
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid view layout (default)
  return (
    <div className="relative bg-white dark:bg-secondary-dark rounded-xl overflow-hidden shadow-sm border border-theme-border dark:border-theme-border-dark h-full flex flex-col">
      {getStatusTag()}
      
      <div className="p-5 flex-grow">
        <div className="mb-4">
          <CategoryBadge category={bounty.category} />
        </div>
        
        <Link href={`/bounties/${bounty.id}`}>
          <a className="block">
            <h3 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark mb-2 line-clamp-2 hover:text-primary dark:hover:text-primary-dark transition-colors">
              {bounty.title}
            </h3>
          </a>
        </Link>
        
        <div className="flex items-center text-xs text-theme-text/70 dark:text-theme-text-dark/70 mb-3">
          <span className="flex items-center">
            <FiDollarSign className="mr-1" />
            {bounty.bounty_amount || "0"} {bounty.token_type || "EGLD"}
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <FiClock className="mr-1" />
            {bounty.estimated_duration}
          </span>
        </div>
        
        <p className="text-sm text-theme-text/80 dark:text-theme-text-dark/80 mb-4 line-clamp-3">
          {bounty.description}
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center">
            <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70 w-24">By:</span>
            <a 
              href={bounty.company_website} 
              target="_blank" 
              rel="noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              {bounty.company_name}
              <FiExternalLink className="ml-1 w-3 h-3" />
            </a>
          </div>
          
          {bounty.deadline && (
            <div className="flex items-center">
              <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70 w-24">Deadline:</span>
              <span className="text-sm text-theme-text dark:text-theme-text-dark flex items-center">
                <FiCalendar className="mr-1" />
                {formatDeadline(bounty.deadline)}
              </span>
            </div>
          )}
          
          <div className="flex items-center">
            <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70 w-24">Skills:</span>
            <div className="flex flex-wrap gap-1">
              {bounty.skills_needed?.slice(0, 3).map((skill, idx) => (
                <span 
                  key={idx} 
                  className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-0.5 rounded-full text-theme-text dark:text-theme-text-dark"
                >
                  {skill}
                </span>
              ))}
              {bounty.skills_needed?.length > 3 && (
                <span className="text-xs text-theme-text/60 dark:text-theme-text-dark/60">
                  +{bounty.skills_needed.length - 3}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="text-xs font-medium text-theme-text/70 dark:text-theme-text-dark/70 w-24">Difficulty:</span>
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
              bounty.difficulty_level === "Easy" 
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                : bounty.difficulty_level === "Medium" 
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
            }`}>
              {bounty.difficulty_level}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4 mt-auto border-t border-theme-border/30 dark:border-theme-border-dark/30">
        {isApplicable ? (
          <Link href={`/bounties/${bounty.id}`}>
            <a className="w-full py-2 px-4 bg-primary dark:bg-primary-dark text-white font-medium text-sm rounded-md flex items-center justify-center hover:bg-primary-dark dark:hover:bg-primary transition-colors">
              <BsLightningCharge className="mr-2" />
              View Details
            </a>
          </Link>
        ) : (
          <Link href={`/bounties/${bounty.id}`}>
            <a className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium text-sm rounded-md flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              View Details
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default BountyCard; 