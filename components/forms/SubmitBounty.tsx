import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useForm, FormProvider } from "react-hook-form";
import Input from "../shared/form/Input";
import Select from "../shared/form/Select";
import Textarea from "../shared/form/Textarea";
import Button from "../shared/Button";
import { FiX, FiSend, FiInfo } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface SubmitBountyProps {
  onClose: () => void;
}

// Define form data interface
interface IBountyForm {
  company_name: string;
  company_website: string;
  company_email: string;
  title: string;
  description: string;
  bounty_amount: string;
  token_type: string;
  estimated_duration: string;
  category: string;
  difficulty_level: string;
  skills_needed: string; // Keep as comma-separated string for input
  link: string;
  deadline: string;
}

// Define options for Select components
const BOUNTY_CATEGORIES = [
  { id: "DeFi", name: "DeFi" },
  { id: "NFT", name: "NFT" },
  { id: "Gaming", name: "Gaming" },
  { id: "Infrastructure", name: "Infrastructure" },
  { id: "SDK", name: "SDK" },
  { id: "Wallet", name: "Wallet" },
  { id: "Bridge", name: "Bridge" },
  { id: "Staking", name: "Staking" },
  { id: "Lending", name: "Lending" },
  { id: "Documentation", name: "Documentation" },
  { id: "DAO", name: "DAO" },
  { id: "Social", name: "Social" },
  { id: "Tools", name: "Tools" },
  { id: "Education", name: "Education" },
  { id: "Other", name: "Other" },
];

const DIFFICULTY_LEVELS = [
  { id: "Easy", name: "Easy" },
  { id: "Medium", name: "Medium" },
  { id: "Hard", name: "Hard" },
];

const TOKEN_TYPES = [
  { id: "EGLD", name: "EGLD" },
  { id: "ESDT", name: "ESDT (Custom Token)" },
];

export default function SubmitBounty({ onClose }: SubmitBountyProps) {
  const formMethods = useForm<IBountyForm>();
  const { handleSubmit, watch } = formMethods;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  
  const tokenType = watch("token_type");
  const bountyAmount = watch("bounty_amount");

  const onSubmit = async (data: IBountyForm) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const { error } = await supabase.from("x_bounties").insert([
        {
          ...data,
          status: "Open",
          skills_needed: data.skills_needed.split(",").map((skill) => skill.trim()), // Process skills string into array
          requirements: [],
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      
      setSubmitStatus("success");
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting bounty:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-secondary dark:bg-secondary-dark rounded-xl shadow-lg p-6 max-w-2xl w-full border border-theme-border/30 dark:border-theme-border-dark/30 overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-theme-title dark:text-theme-title-dark">
            Submit a Bounty
          </h2>
          <button
            onClick={onClose}
            className="text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 flex items-start">
          <FiInfo className="text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium">Bounty Process</p>
            <p className="mb-2">Creating a bounty will list it on the MultiversX Dev Hub for developers to find and apply:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Describe your requirements clearly to attract the right talent</li>
              <li>Set a fair reward based on the complexity and scope</li>
              <li>Review applications and select the best solution</li>
              <li>Coordinate payment directly with the selected developer</li>
            </ul>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {submitStatus === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-green-600 dark:text-green-400 p-4 bg-green-100 dark:bg-green-900/50 rounded-md mb-4"
            >
              Your bounty has been submitted successfully!
            </motion.div>
          )}
          
          {submitStatus === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/50 rounded-md mb-4"
            >
              Submission failed. Please try again.
            </motion.div>
          )}
        </AnimatePresence>

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Fields marked with <span className="text-red-500">*</span> are required
            </div>
            
            {/* Company Section */}
            <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
              <h3 className="text-base font-medium text-theme-title dark:text-theme-title-dark mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark text-xs font-semibold mr-2">1</span>
                Company Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Company Name"
                  name="company_name"
                  placeholder="Your company name"
                  options={{ required: true }}
                />
                <Input
                  label="Company Website"
                  name="company_website"
                  type="url"
                  placeholder="https://your-company.com"
                  options={{ required: true }}
                />
              </div>
              
              <div className="mt-4">
                <Input
                  label="Contact Email"
                  name="company_email"
                  type="email"
                  placeholder="contact@your-company.com"
                  options={{ 
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Bounty Section */}
            <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
              <h3 className="text-base font-medium text-theme-title dark:text-theme-title-dark mb-4 flex items-center">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark text-xs font-semibold mr-2">2</span>
                Bounty Details
              </h3>

              <Input
                label="Bounty Title"
                name="title"
                placeholder="e.g., Build a DeFi Dashboard"
                options={{ required: true }}
              />

              <Textarea
                label="Description"
                name="description"
                placeholder="Describe the bounty requirements and deliverables..."
                options={{ required: true }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <Select
                    label="Token Type"
                    name="token_type"
                    options={{ required: true }}
                    selectOptions={[{ id: "", name: "Select token" }, ...TOKEN_TYPES]}
                  />
                </div>
                <Input
                  label="Bounty Amount"
                  name="bounty_amount"
                  placeholder={tokenType === "EGLD" ? "e.g., 5" : "e.g., 1000"}
                  options={{ required: true }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <Input
                  label="Estimated Duration"
                  name="estimated_duration"
                  placeholder="e.g., 2 weeks"
                  options={{ required: true }}
                />
                <Input
                  label="Deadline"
                  name="deadline"
                  type="date"
                  options={{ required: true }}
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <Select
                  label="Category"
                  name="category"
                  options={{ required: true }}
                  selectOptions={[{ id: "", name: "Select category" }, ...BOUNTY_CATEGORIES]}
                />
                <Select
                  label="Difficulty Level"
                  name="difficulty_level"
                  options={{ required: true }}
                  selectOptions={[{ id: "", name: "Select difficulty" }, ...DIFFICULTY_LEVELS]}
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Required Skills"
                  name="skills_needed"
                  placeholder="e.g., React, Rust, Solidity (comma-separated)"
                  options={{ required: true }}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">Comma-separated list</p>
              </div>

              <div className="mt-4">
                <Input
                  label="Link to Bounty Details (Optional)"
                  name="link"
                  type="url"
                  placeholder="https://github.com/your-repo/issues/1"
                  options={{}}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-theme-text dark:text-theme-text-dark bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <Button
                label={isSubmitting ? "Submitting..." : "Submit Bounty"}
                icon={FiSend}
                disabled={isSubmitting}
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
} 