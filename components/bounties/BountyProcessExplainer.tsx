import React from "react";
import { Tab } from "@headlessui/react";
import { FiUsers, FiCode, FiDollarSign, FiCheckCircle, FiShield, FiAward, FiBriefcase } from "react-icons/fi";

const BountyProcessExplainer = () => {
  return (
    <div className="w-full bg-white dark:bg-secondary-dark rounded-xl overflow-hidden shadow-sm border border-theme-border dark:border-theme-border-dark">
      <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-secondary-dark p-6 border-b border-theme-border dark:border-theme-border-dark">
        <h2 className="text-xl font-bold text-theme-title dark:text-theme-title-dark">
          How the Bounty System Works
        </h2>
        <p className="text-theme-text dark:text-theme-text-dark mt-2">
          Our bounty system connects companies with talented developers in the MultiversX ecosystem.
        </p>
      </div>

      <Tab.Group>
        <Tab.List className="flex border-b border-theme-border dark:border-theme-border-dark">
          <Tab
            className={({ selected }) =>
              `flex-1 py-4 px-4 text-sm font-medium focus:outline-none ${
                selected
                  ? "text-primary dark:text-primary-dark border-b-2 border-primary dark:border-primary-dark"
                  : "text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark"
              }`
            }
          >
            <div className="flex items-center justify-center">
              <FiUsers className="mr-2" />
              <span>For Companies</span>
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              `flex-1 py-4 px-4 text-sm font-medium focus:outline-none ${
                selected
                  ? "text-primary dark:text-primary-dark border-b-2 border-primary dark:border-primary-dark"
                  : "text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark"
              }`
            }
          >
            <div className="flex items-center justify-center">
              <FiCode className="mr-2" />
              <span>For Developers</span>
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              `flex-1 py-4 px-4 text-sm font-medium focus:outline-none ${
                selected
                  ? "text-primary dark:text-primary-dark border-b-2 border-primary dark:border-primary-dark"
                  : "text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark"
              }`
            }
          >
            <div className="flex items-center justify-center">
              <FiBriefcase className="mr-2" />
              <span>PeerMe Bounties</span>
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel className="p-6">
            <h3 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark mb-4">
              Posting Bounties (for Companies & Teams via PeerMe)
            </h3>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">1</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-medium text-theme-title dark:text-theme-title-dark">
                    Create a Quest/Bounty on PeerMe
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    Define your project requirements, reward amount, and deadline directly on the PeerMe platform. Bounties are often created by teams.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">2</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-medium text-theme-title dark:text-theme-title-dark flex items-center">
                    <FiDollarSign className="mr-2 text-green-500" />
                    Fund Quest via Vault (for Teams)
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    Teams typically fund their quests/bounties through the PeerMe Vault system to ensure rewards are secured.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">3</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-medium text-theme-title dark:text-theme-title-dark">
                    Manage Permissions & Proposals
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    Configure who can manage the bounty. For teams with multiple members, actions like review and winner selection might require internal proposals on PeerMe.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">4</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-medium text-theme-title dark:text-theme-title-dark flex items-center">
                    <FiAward className="mr-2 text-yellow-500" />
                    Review Submissions & Select Winner on PeerMe
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    Evaluate proposals and solutions submitted by developers on the PeerMe platform and select the winner according to your criteria.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-base font-medium text-theme-title dark:text-theme-title-dark flex items-center mb-2">
                <FiShield className="mr-2 text-purple-500" />
                Benefits for Companies (using PeerMe)
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-theme-text dark:text-theme-text-dark">
                <li>Leverage PeerMe's established platform for bounty management and payments.</li>
                <li>Access a community of developers familiar with the PeerMe ecosystem.</li>
                <li>Utilize team features like Vault funding and proposal mechanisms.</li>
                <li>Streamlined process for creating, managing, and rewarding bounties.</li>
              </ul>
            </div>
          </Tab.Panel>
          
          <Tab.Panel className="p-6">
            <h3 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark mb-4">
              Applying for Bounties (for Developers via PeerMe)
            </h3>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">1</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-medium text-theme-title dark:text-theme-title-dark">
                    Find a Bounty on this Hub (or PeerMe)
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    Browse available bounties listed here, which are sourced from PeerMe. Match opportunities with your skills.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">2</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-medium text-theme-title dark:text-theme-title-dark">
                    Create or Use Your PeerMe Account
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    To submit proposals or solutions, you will need an account on the PeerMe platform. Follow the link from the bounty details page.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">3</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-medium text-theme-title dark:text-theme-title-dark flex items-center">
                    <FiCode className="mr-2 text-indigo-500" />
                    Submit Your Proposal/Solution on PeerMe
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    Follow the specific bounty instructions on PeerMe to submit your work, proposal, or application through their platform.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">4</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-medium text-theme-title dark:text-theme-title-dark flex items-center">
                    <FiCheckCircle className="mr-2 text-green-500" />
                    Get Selected & Receive Payment via PeerMe
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    If your submission is selected, the company/team will notify you through PeerMe. Payments and further coordination will also be handled via PeerMe.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-base font-medium text-theme-title dark:text-theme-title-dark flex items-center mb-2">
                <FiShield className="mr-2 text-purple-500" />
                Benefits for Developers (via PeerMe)
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-theme-text dark:text-theme-text-dark">
                <li>Access bounties from various teams and projects using the PeerMe platform.</li>
                <li>Clear process for submissions and transparent reward structures on PeerMe.</li>
                <li>Build your reputation within the PeerMe community and potentially find more work.</li>
                <li>Secure payments often handled through PeerMe's Vault system.</li>
              </ul>
            </div>
          </Tab.Panel>
          
          <Tab.Panel className="p-6">
            <h3 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark mb-4">
              PeerMe Bounty Process
            </h3>
            <div className="space-y-4 text-sm text-theme-text dark:text-theme-text-dark">
              <p>
                The PeerMe platform offers a flexible bounty system. Here's how it generally works:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Team-Based Quests:</strong> Currently, the system is optimized for teams. Teams can fund quests through a Vault.
                </li>
                <li>
                  <strong>Permissions:</strong> Anyone with appropriate permissions within a team can directly create quests, review submissions, select winners, etc.
                </li>
                <li>
                  <strong>Proposals for Teams:</strong> If multiple people are part of a team, actions like quest creation and winner selection might require proposals to ensure consensus.
                </li>
                <li>
                  <strong>Direct User Bounties (Future):</strong> The platform is designed to support direct user bounties in the future, allowing individuals to create bounties without needing to form a team first.
                </li>
                <li>
                  <strong>Consideration for Direct Creation Now:</strong> It's worth exploring if users can directly create bounties even with the current team-focused setup, potentially by treating an individual as a "team of one."
                </li>
              </ul>
              <p className="mt-4">
                This integration aims to leverage PeerMe's capabilities to manage and display bounties within our ecosystem.
              </p>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default BountyProcessExplainer; 