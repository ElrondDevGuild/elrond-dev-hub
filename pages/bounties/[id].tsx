import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { NextSeo } from 'next-seo';
import Layout from '../../components/Layout';
import CategoryBadge from '../../components/shared/CategoryBadge';
import Button from '../../components/shared/Button';
import ApplyForBounty from '../../components/forms/ApplyForBounty';
import BountyProcessExplainer from '../../components/bounties/BountyProcessExplainer';
import { FiArrowLeft, FiCalendar, FiClock, FiDollarSign, FiExternalLink, FiUser } from 'react-icons/fi';
import { BsCheck2Circle, BsExclamationTriangle, BsLightningCharge } from 'react-icons/bs';
import Link from 'next/link';

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface for the bounty data structure
interface BountyItem {
  id: string;
  title: string;
  description: string;
  status: string;
  bounty_amount: string;
  token_type?: string;
  estimated_duration: string;
  category: string;
  difficulty_level: string;
  company_name: string;
  company_website: string;
  company_email: string;
  link: string | null;
  skills_needed: string[];
  deadline: string | null;
  requirements?: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Props for the BountyDetailPage component
interface BountyDetailPageProps {
  bounty: BountyItem | null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { id } = context.params || {};
    
    if (!id) {
      return {
        notFound: true,
      };
    }
    
    // Fetch the bounty data from Supabase
    const { data, error } = await supabase
      .from('x_bounties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching bounty data:', error);
      return {
        notFound: true,
      };
    }
    
    return {
      props: {
        bounty: data,
      },
    };
  } catch (err) {
    console.error('Error in getServerSideProps:', err);
    return {
      notFound: true,
    };
  }
};

export default function BountyDetailPage({ bounty }: BountyDetailPageProps) {
  const [showApplyForm, setShowApplyForm] = useState(false);
  
  // Handle case where bounty is null
  if (!bounty) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-theme-title dark:text-theme-title-dark mb-4">
            Bounty not found
          </h1>
          <p className="text-theme-text dark:text-theme-text-dark mb-6">
            The bounty you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/bounties">
            <Button label="Back to Bounties" icon={FiArrowLeft} />
          </Link>
        </div>
      </Layout>
    );
  }
  
  // Format deadline for display
  const formatDeadline = (dateStr: string | null) => {
    if (!dateStr) return "No deadline";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  // Format date for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  // Get status
  const getStatusInfo = () => {
    if (bounty.status === "Open") {
      return {
        label: "Open for Applications",
        icon: BsCheck2Circle,
        className: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
      };
    } else if (bounty.status === "Pending") {
      return {
        label: "Pending Review",
        icon: BsExclamationTriangle,
        className: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
      };
    } else if (bounty.status === "Closed") {
      return {
        label: "Closed",
        icon: BsExclamationTriangle,
        className: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
      };
    }
    
    return {
      label: "Status: " + bounty.status,
      icon: BsExclamationTriangle,
      className: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    };
  };
  
  const statusInfo = getStatusInfo();
  const isApplicable = bounty.status === "Open";
  
  return (
    <Layout hideRightBar={true}>
      <NextSeo
        title={`${bounty.title} | MultiversX Bounty`}
        description={`${bounty.description.substring(0, 160)}...`}
        openGraph={{
          title: `${bounty.title} | MultiversX Bounty`,
          description: bounty.description.substring(0, 160),
          images: [
            {
              url: 'https://xdevhub.com/og-image.png',
              width: 1200,
              height: 675,
              type: 'image/png',
            },
          ],
        }}
      />
      
      <div className="container mx-auto px-4 py-6">
        <Link href="/bounties">
          <a className="inline-flex items-center text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark mb-6">
            <FiArrowLeft className="mr-2" />
            Back to Bounties
          </a>
        </Link>
        
        <div className="bg-white dark:bg-secondary-dark rounded-xl overflow-hidden shadow-sm border border-theme-border dark:border-theme-border-dark mb-8">
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <CategoryBadge category={bounty.category} />
              
              <span className={`px-3 py-1 rounded-md text-xs font-medium ${
                bounty.difficulty_level === "Easy" 
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                  : bounty.difficulty_level === "Medium" 
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
              }`}>
                {bounty.difficulty_level}
              </span>
              
              <span className={`flex items-center px-3 py-1 rounded-md text-xs font-medium ${statusInfo.className}`}>
                <statusInfo.icon className="mr-1" />
                {statusInfo.label}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-theme-title dark:text-theme-title-dark mb-4">
              {bounty.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-theme-text dark:text-theme-text-dark">
              <span className="flex items-center">
                <FiDollarSign className="mr-1" />
                {bounty.bounty_amount} {bounty.token_type || "EGLD"}
              </span>
              
              <span className="flex items-center">
                <FiClock className="mr-1" />
                {bounty.estimated_duration}
              </span>
              
              {bounty.deadline && (
                <span className="flex items-center">
                  <FiCalendar className="mr-1" />
                  Deadline: {formatDeadline(bounty.deadline)}
                </span>
              )}
              
              {bounty.published_at && (
                <span className="flex items-center">
                  <FiCalendar className="mr-1" />
                  Posted: {formatDate(bounty.published_at)}
                </span>
              )}
            </div>

            {/* Company Info - Moved from sidebar */}
            <div className="flex items-center p-4 mb-6 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                <FiUser className="text-primary dark:text-primary-dark" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-theme-title dark:text-theme-title-dark">
                  {bounty.company_name}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <a 
                    href={bounty.company_website} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    Visit Website
                    <FiExternalLink className="ml-1 w-3 h-3" />
                  </a>
                  <span className="text-theme-text/70 dark:text-theme-text-dark/70">
                    Contact: <a 
                      href={`mailto:${bounty.company_email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {bounty.company_email}
                    </a>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark mb-3">
                Description
              </h2>
              <div className="prose dark:prose-dark max-w-none">
                <p className="text-theme-text dark:text-theme-text-dark whitespace-pre-line">
                  {bounty.description}
                </p>
              </div>
            </div>
            
            {bounty.requirements && bounty.requirements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark mb-3">
                  Requirements
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-theme-text dark:text-theme-text-dark">
                  {bounty.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark mb-3">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {bounty.skills_needed.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-theme-text dark:text-theme-text-dark"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {bounty.link && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark mb-3">
                  Additional Resources
                </h2>
                <a 
                  href={bounty.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Additional Details
                  <FiExternalLink className="ml-1" />
                </a>
              </div>
            )}
            
            <div className="mt-10">
              {isApplicable ? (
                <div>
                  <Button
                    label="Apply for this Bounty"
                    icon={BsLightningCharge}
                    onClick={() => setShowApplyForm(true)}
                  />
                </div>
              ) : (
                <button
                  disabled
                  className="py-3 px-8 text-base bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium rounded-md flex items-center justify-center cursor-not-allowed"
                >
                  Not Available
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Bounty Process - Made more compact */}
        <div className="mb-8">
          <details className="bg-white dark:bg-secondary-dark rounded-xl overflow-hidden shadow-sm border border-theme-border dark:border-theme-border-dark">
            <summary className="p-4 cursor-pointer font-medium text-theme-title dark:text-theme-title-dark">
              How the Bounty Process Works
            </summary>
            <div className="p-4 pt-0">
              <BountyProcessExplainer />
            </div>
          </details>
        </div>
      </div>
      
      {showApplyForm && (
        <ApplyForBounty
          bountyId={bounty.id}
          bountyTitle={bounty.title}
          companyName={bounty.company_name}
          onClose={() => setShowApplyForm(false)}
        />
      )}
    </Layout>
  );
} 