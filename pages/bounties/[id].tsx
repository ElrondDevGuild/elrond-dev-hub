import { GetServerSideProps } from 'next';
import { useState } from 'react';
// import { createClient } from '@supabase/supabase-js'; // Replaced with PeerMe API fetch
import { NextSeo } from 'next-seo';
import Layout from '../../components/Layout';
// import CategoryBadge from '../../components/shared/CategoryBadge'; // Replaced by tags
import Button from '../../components/shared/Button';
// import ApplyForBounty from '../../components/forms/ApplyForBounty'; // Application is on PeerMe
import BountyProcessExplainer from '../../components/bounties/BountyProcessExplainer';
import { FiArrowLeft, FiCalendar, FiClock, FiDollarSign, FiShield, FiExternalLink, FiUser, FiUsers, FiTag, FiLayers, FiGlobe, FiCheckCircle } from 'react-icons/fi'; // Added icons
import { BsCheck2Circle, BsExclamationTriangle, BsLightningCharge, BsClock, BsShield, BsBriefcase } from 'react-icons/bs';
import Link from 'next/link';
import { marked } from 'marked'; // For rendering markdown description
import Image from 'next/image';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// const supabase = createClient(supabaseUrl, supabaseKey);

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

interface BountyDetailPageProps {
  bounty: PeerMeBounty | null;
  error?: string; // To pass potential fetch errors
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  if (!id || typeof id !== 'string') {
    return { notFound: true };
  }

  try {
    const apiKey = process.env.PEERME_API_KEY;
    if (!apiKey) {
      console.error("PeerMe API key is not configured.");
      return { props: { bounty: null, error: "API key not configured." } }; 
    }

    const peerMeOrgId = "xalliance"; 
    const response = await fetch(
      `https://api.peerme.io/v1/entities/${peerMeOrgId}/bounties`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching bounties from PeerMe API:", response.status, errorText);
      return { notFound: true }; 
    }

    const responseData = await response.json();
    // Handle the nested data structure in the API response
    const allBounties = responseData.data || [];
    
    const singleBounty = allBounties.find((b: any) => b.id === id);

    if (!singleBounty) {
      return { notFound: true };
    }

    return {
      props: {
        bounty: singleBounty,
      },
    };
  } catch (err: any) {
    console.error(`Error in getServerSideProps for bounty ID ${id}:`, err);
    return { notFound: true }; 
  }
};

export default function BountyDetailPage({ bounty, error }: BountyDetailPageProps) {  
  if (error && !bounty) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-3xl font-bold text-theme-title dark:text-theme-title-dark mb-4">
            Error Loading Bounty
          </h1>
          <p className="text-theme-text dark:text-theme-text-dark mb-2">
            There was an issue fetching the bounty details: {error}
          </p>
          <p className="text-theme-text dark:text-theme-text-dark mb-6">
            Please try again later or check the main bounties page.
          </p>
          <Link href="/bounties">
            <Button label="Back to Bounties" icon={FiArrowLeft} />
          </Link>
        </div>
      </Layout>
    );
  }

  if (!bounty) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-3xl font-bold text-theme-title dark:text-theme-title-dark mb-4">
            Bounty not found
          </h1>
          <p className="text-theme-text dark:text-theme-text-dark mb-6">
            The bounty you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/bounties">
            <Button label="Back to Bounties" icon={FiArrowLeft} />
          </Link>
        </div>
      </Layout>
    );
  }
  
  // Format date for display (e.g., "January 15, 2023")
  const formatDisplayDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "Not specified";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time remaining until deadline
  const formatTimeRemaining = (dateStr: string | null | undefined) => {
    if (!dateStr || bounty.hasDeadlineEnded) return null;
    
    const deadline = new Date(dateStr);
    const now = new Date();
    
    if (deadline <= now) return null;
    
    const diffTime = Math.abs(deadline.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { text: "Ends today!", urgent: true };
    if (diffDays === 1) return { text: "Ends tomorrow", urgent: true };
    if (diffDays <= 3) return { text: `${diffDays} days left`, urgent: true };
    if (diffDays <= 7) return { text: `${diffDays} days left`, urgent: false };
    
    const weeks = Math.floor(diffDays / 7);
    return { text: `${weeks} ${weeks === 1 ? 'week' : 'weeks'} left`, urgent: false };
  };
  
  // Get status information with appropriate styling
  const getStatusInfo = () => {
    let icon, text, colorClasses;
    switch (bounty.status) {
      case "open":
        icon = BsCheck2Circle;
        text = "Open for Applications";
        colorClasses = "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800";
        break;
      case "in_progress":
        icon = BsLightningCharge;
        text = "In Progress";
        colorClasses = "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
        break;
      case "evaluating":
        icon = BsClock;
        text = "Evaluating";
        colorClasses = "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800";
        break;
      case "closed":
        icon = BsExclamationTriangle;
        text = "Closed";
        colorClasses = "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800";
        break;
      case "completed":
        icon = BsCheck2Circle; 
        text = "Completed";
        colorClasses = "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800";
        break;
      default:
        icon = BsExclamationTriangle;
        text = `Status: ${bounty.status}`;
        colorClasses = "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700";
    }
    return { label: text, icon: icon, className: colorClasses };
  };
  
  const statusInfo = getStatusInfo();
  const creatorName = bounty.entity?.name || "Unknown";
  const creatorLogo = bounty.entity?.avatarUrl;
  const timeRemaining = formatTimeRemaining(bounty.deadlineAt);
  
  // Parse markdown content for description
  const renderedDescription = bounty.description 
    ? marked.parse(bounty.description) as string 
    : '<p>No description provided.</p>';

  // Format payment amount
  const formatPaymentAmount = () => {
    if (!bounty.payments || bounty.payments.length === 0) return "Not specified";
    
    const payment = bounty.payments[0]; // Get first payment
    const amount = parseInt(payment.amount) / Math.pow(10, payment.tokenDecimals);
    
    return { 
      amount: amount.toLocaleString(undefined, { maximumFractionDigits: 2 }), 
      tokenName: payment.tokenName,
      tokenLogo: payment.tokenLogo 
    };
  };

  const payment = formatPaymentAmount();

  return (
    <Layout hideRightBar={true}>
      <NextSeo
        title={`${bounty.title} | PeerMe Bounty`}
        description={bounty.description ? bounty.description.substring(0, 160).replace(/\*\*|\*/g, '').replace(/<[^>]*>?/gm, '') + '...' : 'View this bounty from PeerMe.'}
        openGraph={{
          title: `${bounty.title} | PeerMe Bounty`,
          description: bounty.description ? bounty.description.substring(0, 160).replace(/\*\*|\*/g, '').replace(/<[^>]*>?/gm, '') + '...' : 'View this bounty from PeerMe.',
          images: [
            {
              url: 'https://xdevhub.com/og-image.png', // Consider a dynamic or PeerMe specific OG image
              width: 1200,
              height: 675,
              type: 'image/png',
            },
          ],
        }}
      />
      
      {error && (
        <div className="container mx-auto my-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <p className="text-sm font-medium">Note: {error}</p>
        </div>
      )}

      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/bounties">
            <a className="inline-flex items-center text-sm text-theme-text/70 dark:text-theme-text-dark/70 hover:text-theme-text dark:hover:text-theme-text-dark transition-colors">
              <FiArrowLeft className="mr-2" /> Back to All Bounties
            </a>
          </Link>
          
          <a 
            href={bounty.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-medium text-primary dark:text-primary-dark hover:text-primary-dark dark:hover:text-primary inline-flex items-center"
          >
            <FiExternalLink className="mr-1.5" /> View on PeerMe
          </a>
        </div>
        
        <div className="bg-white dark:bg-secondary-dark rounded-xl overflow-hidden shadow-md border border-theme-border dark:border-theme-border-dark mb-8">
          {/* Remove the gradient header and keep only single content section */}
          <div className="p-6 sm:p-8">
            {/* Status badges at top */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium ${statusInfo.className}`}>
                <statusInfo.icon className="mr-1.5" /> {statusInfo.label}
              </span>
              
              {bounty.competition && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  <FiUsers className="mr-1.5" /> Competition
                </span>
              )}
            </div>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-theme-title dark:text-theme-title-dark mb-6">
              {bounty.title}
            </h1>
            
            {/* Detailed information panel */}
            <div className="mb-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark flex items-center">
                  <BsBriefcase className="mr-2 text-theme-text/70 dark:text-theme-text-dark/70" /> 
                  Bounty Details
                </h3>
                
                {/* Reward amount on the right */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary-dark/10 dark:to-primary-dark/20 p-3 rounded-lg border border-primary/10 dark:border-primary-dark/10">
                  <div className="text-xs font-medium text-theme-text/80 dark:text-theme-text-dark/80 mb-1">Reward</div>
                  <div className="flex items-center">
                    {typeof payment !== 'string' && payment.tokenLogo && (
                      <div className="w-5 h-5 mr-2 relative rounded-full overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                        <Image 
                          src={payment.tokenLogo} 
                          alt={payment.tokenName || "Token"}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className="text-lg font-bold text-primary dark:text-primary-dark flex items-center">
                      {typeof payment === 'string' ? payment : (
                        <>
                          {payment.amount} <span className="ml-1">{payment.tokenName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Entity/Organization with logo */}
                <div className="flex items-start">
                  <FiUsers className="mt-0.5 mr-3 text-theme-text/70 dark:text-theme-text-dark/70" />
                  <div>
                    <div className="font-medium text-theme-title dark:text-theme-title-dark">Posted By</div>
                    <div className="text-theme-text dark:text-theme-text-dark flex items-center">
                      {creatorLogo ? (
                        <div className="w-4 h-4 mr-1.5 relative rounded-full overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                          <Image 
                            src={creatorLogo} 
                            alt={creatorName}
                            width={16}
                            height={16}
                            className="object-cover rounded-full bg-center"
                          />
                        </div>
                      ) : null}
                      {creatorName}
                      {bounty.entity?.verified && (
                        <FiCheckCircle className="ml-1.5 text-green-500 dark:text-green-400" />
                      )}
                    </div>
                    {bounty.entity?.slug && (
                      <div className="text-xs text-theme-text/60 dark:text-theme-text-dark/60 mt-0.5">
                        Slug: {bounty.entity.slug}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Deadline */}
                <div className="flex items-start">
                  <FiCalendar className="mt-0.5 mr-3 text-theme-text/70 dark:text-theme-text-dark/70" />
                  <div>
                    <div className="font-medium text-theme-title dark:text-theme-title-dark">Deadline</div>
                    <div className={`text-theme-text dark:text-theme-text-dark flex items-center ${bounty.hasDeadlineEnded ? "text-red-500 dark:text-red-400" : ""}`}>
                      {formatDisplayDate(bounty.deadlineAt)}
                      {bounty.hasDeadlineEnded && (
                        <span className="ml-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 text-xs rounded-md">Ended</span>
                      )}
                    </div>
                    {timeRemaining && (
                      <div className={`text-xs mt-1 font-medium ${timeRemaining.urgent ? "text-yellow-600 dark:text-yellow-400" : "text-blue-600 dark:text-blue-400"}`}>
                        {timeRemaining.text}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Created date */}
                <div className="flex items-start">
                  <FiClock className="mt-0.5 mr-3 text-theme-text/70 dark:text-theme-text-dark/70" />
                  <div>
                    <div className="font-medium text-theme-title dark:text-theme-title-dark">Created</div>
                    <div className="text-theme-text dark:text-theme-text-dark">
                      {formatDisplayDate(bounty.createdAt)}
                    </div>
                  </div>
                </div>
                
                {/* Chain ID */}
                {bounty.chainId && (
                  <div className="flex items-start">
                    <FiLayers className="mt-0.5 mr-3 text-theme-text/70 dark:text-theme-text-dark/70" />
                    <div>
                      <div className="font-medium text-theme-title dark:text-theme-title-dark">Chain ID</div>
                      <div className="text-theme-text dark:text-theme-text-dark">{bounty.chainId}</div>
                    </div>
                  </div>
                )}
                
                {/* Competition type - only shown if it's a competition */}
                {bounty.competition && (
                  <div className="flex items-start">
                    <FiShield className="mt-0.5 mr-3 text-theme-text/70 dark:text-theme-text-dark/70" />
                    <div>
                      <div className="font-medium text-theme-title dark:text-theme-title-dark">Type</div>
                      <div className="text-theme-text dark:text-theme-text-dark">
                        Competition Bounty
                      </div>
                      <div className="text-xs text-theme-text/60 dark:text-theme-text-dark/60 mt-0.5">
                        Multiple developers can apply and compete
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* PeerMe Link */}
              <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a 
                  href={bounty.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-md font-medium hover:bg-primary-dark dark:hover:bg-primary transition-colors"
                >
                  <FiExternalLink className="mr-1.5" /> View on PeerMe
                </a>
                {bounty.status === "open" && (
                  <a 
                    href={bounty.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-4 py-2 ml-3 bg-green-600 dark:bg-green-700 text-white rounded-md font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                  >
                    <FiExternalLink className="mr-1.5" /> Apply Now
                  </a>
                )}
              </div>
            </div>
            
            {/* Description section */}
            <div>
              <h3 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark mb-4">Description</h3>
              <div className="prose prose-sm sm:prose dark:prose-invert max-w-none text-theme-text dark:text-theme-text-dark">
                <div dangerouslySetInnerHTML={{ __html: renderedDescription }} />
              </div>
              
              {/* Tags section - if present */}
              {bounty.tags && bounty.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark mb-3 flex items-center">
                    <FiTag className="mr-2 text-theme-text/70 dark:text-theme-text-dark/70" /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {bounty.tags.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-12 mb-8">
          <BountyProcessExplainer />
        </div>
      </div>
    </Layout>
  );
} 