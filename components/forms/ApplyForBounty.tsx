import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useForm, FormProvider } from "react-hook-form";
import Input from "../shared/form/Input";
import Textarea from "../shared/form/Textarea";
import Button from "../shared/Button";
import { FiX, FiSend, FiInfo } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface ApplyForBountyProps {
  bountyId: string;
  bountyTitle: string;
  companyName: string;
  onClose: () => void;
}

// Define form data interface
interface IBountyApplicationForm {
  full_name: string;
  email: string;
  github_profile: string;
  wallet_address: string;
  implementation_url: string;
  cover_letter: string;
  additional_links: string;
  estimated_delivery: string;
}

export default function ApplyForBounty({ bountyId, bountyTitle, companyName, onClose }: ApplyForBountyProps) {
  const formMethods = useForm<IBountyApplicationForm>();
  const { handleSubmit } = formMethods;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const onSubmit = async (data: IBountyApplicationForm) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      // Save to x_bounty_applications table
      const { error } = await supabase.from("x_bounty_applications").insert([
        {
          bounty_id: bountyId,
          full_name: data.full_name,
          email: data.email,
          github_profile: data.github_profile,
          wallet_address: data.wallet_address,
          implementation_url: data.implementation_url,
          cover_letter: data.cover_letter,
          additional_links: data.additional_links ? data.additional_links.split(',').map(link => link.trim()) : [],
          estimated_delivery: data.estimated_delivery,
          status: "Submitted",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      setSubmitStatus("success");
      formMethods.reset(); // Reset form on success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
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
            Apply for Bounty
          </h2>
          <button
            onClick={onClose}
            className="text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-3">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300">Bounty Details:</h3>
            <p className="text-blue-700 dark:text-blue-400 text-sm">{bountyTitle}</p>
            <p className="text-xs text-blue-600 dark:text-blue-500">By {companyName}</p>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg flex items-start">
            <FiInfo className="text-amber-600 dark:text-amber-400 mt-1 mr-2 flex-shrink-0" />
            <div className="text-sm text-amber-800 dark:text-amber-300">
              <p className="font-medium">Application Process</p>
              <p>Submit your solution details and contact information. If selected, the company will reach out to coordinate payment and next steps.</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {submitStatus === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-green-600 dark:text-green-400 p-4 bg-green-100 dark:bg-green-900/50 rounded-md mb-4"
            >
              Your application has been submitted successfully! The company will review your submission.
            </motion.div>
          ) : submitStatus === "error" ? (
             <motion.div
               key="error"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="text-center text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/50 rounded-md mb-4"
             >
               Submission failed. Please try again.
             </motion.div>
          ) : null}
        </AnimatePresence>

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
             <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
               Fields marked with <span className="text-red-500">*</span> are required
             </div>
             
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="full_name"
                placeholder="Your full name"
                options={{ required: true }}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                options={{ 
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="GitHub Profile"
                name="github_profile"
                type="url"
                placeholder="https://github.com/yourusername"
                options={{ required: true }}
              />
              <Input
                label="Wallet Address"
                name="wallet_address"
                placeholder="Your MultiversX wallet address"
                options={{ required: true }}
              />
            </div>

            <div>
              <Input
                label="Implementation URL"
                name="implementation_url"
                type="url"
                placeholder="https://github.com/yourusername/your-solution"
                options={{ required: true }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">Link to your solution repository, PR, or deployed application</p>
            </div>

            <Textarea
              label="Cover Letter / Implementation Details"
              name="cover_letter"
              placeholder="Describe your approach, implementation details, and why you're a good fit for this bounty..."
              options={{ required: true }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Additional Links (Optional)"
                  name="additional_links"
                  placeholder="https://example.com, https://demo.app"
                  options={{}}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">Comma-separated links to demos, docs, etc.</p>
              </div>
              <Input
                label="Estimated Delivery"
                name="estimated_delivery"
                placeholder="e.g., 1 week"
                options={{ required: true }}
              />
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
                 label={isSubmitting ? "Submitting..." : "Submit Application"}
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