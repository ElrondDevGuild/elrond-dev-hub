import React from "react";
import { Tab } from "@headlessui/react";
import { FiUsers, FiCode, FiDollarSign, FiCheckCircle, FiShield, FiAward } from "react-icons/fi";

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
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel className="p-6">
            <h3 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark mb-4">
              Creating and Managing Bounties
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
                    Create a Bounty
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    Define your project requirements, set the reward amount, and specify the deadline.
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
                    Set Reward
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    Offer competitive compensation to attract quality developers. Payment is coordinated directly with the selected developer.
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
                    Review Submissions
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    Evaluate the solutions submitted by developers based on quality, completeness, and adherence to requirements.
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
                    Select a Winner
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    Choose the best solution and work directly with the developer to finalize implementation and payment.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-base font-medium text-theme-title dark:text-theme-title-dark flex items-center mb-2">
                <FiShield className="mr-2 text-purple-500" />
                Benefits for Companies
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-theme-text dark:text-theme-text-dark">
                <li>Access to a pool of talented MultiversX developers</li>
                <li>Define specific project requirements and deliverables</li>
                <li>Only pay for solutions that meet your criteria</li>
                <li>Find specialized expertise for specific tasks</li>
                <li>Build relationships with skilled developers in the MultiversX ecosystem</li>
              </ul>
            </div>
          </Tab.Panel>
          
          <Tab.Panel className="p-6">
            <h3 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark mb-4">
              Applying for and Completing Bounties
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
                    Find a Bounty
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    Browse available bounties that match your skills and interests.
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
                    Develop Your Solution
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    Create and test your implementation based on the bounty requirements.
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
                    Submit Your Application
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    Submit your solution through our platform with details about your implementation and approach.
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
                    Receive Payment
                  </h4>
                  <p className="text-sm text-theme-text dark:text-theme-text-dark mt-1">
                    If your solution is selected, coordinate with the company to finalize the implementation and receive payment.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-base font-medium text-theme-title dark:text-theme-title-dark flex items-center mb-2">
                <FiShield className="mr-2 text-purple-500" />
                Benefits for Developers
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-theme-text dark:text-theme-text-dark">
                <li>Access paid work opportunities in the MultiversX ecosystem</li>
                <li>Work on interesting projects with clear requirements</li>
                <li>Build your reputation in the MultiversX community</li>
                <li>Learn new skills and technologies</li>
                <li>Showcase your work to potential long-term clients</li>
              </ul>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default BountyProcessExplainer; 