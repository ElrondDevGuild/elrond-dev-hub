import { useState } from "react";
import CategoryBadge from "../shared/CategoryBadge";
import { createClient } from "@supabase/supabase-js";
import { useForm, FormProvider } from "react-hook-form";
import Input from "../shared/form/Input";
import Select from "../shared/form/Select";
import Textarea from "../shared/form/Textarea";
import Button from "../shared/Button";
import { FiX, FiSend } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SubmitTeamFinderProps {
  onClose: () => void;
}

interface ITeamFinderForm {
  name: string;
  description: string;
  profile_image_url: string;
  skills: string;
  main_expertise: string;
  availability: string;
  experience: string;
  interests: string;
  github_url: string;
  twitter_url: string;
  telegram_url: string;
  website_url: string;
}

const EXPERTISE_OPTIONS = [
  "Smart Contract",
  "Frontend",
  "Backend",
  "Full Stack",
  "DevOps & Infrastructure",
  "Security & Auditing",
  "Testing & QA",
  "Mobile",
  "UI/UX Design",
  "Graphic Design",
  "Product Design",
  "Community Management",
  "Marketing & Growth",
  "Business",
  "Project Management",
  "Technical Writing",
  "Documentation",
  "Blockchain Architecture",
  "Token Economics",
  "DeFi",
  "NFT",
  "GameFi",
  "Cross-chain Integration",
  "Research &",
  "Technical Support",
  "Other",
].map(opt => ({ id: opt, name: opt }));

const AVAILABILITY_OPTIONS = [
  "Full-time Available",
  "Part-time (20+ hours/week)",
  "Part-time (10-20 hours/week)",
  "Part-time (5-10 hours/week)",
  "Few hours per week",
  "Available for specific projects",
  "Currently busy",
  "Available for mentoring only",
].map(opt => ({ id: opt, name: opt }));

export default function SubmitTeamFinder({ onClose }: SubmitTeamFinderProps) {
  const formMethods = useForm<ITeamFinderForm>();
  const { handleSubmit } = formMethods;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const onSubmit = async (data: ITeamFinderForm) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const { error } = await supabase.from("x_developers").insert([
        {
          ...data,
          skills: data.skills.split(",").map(skill => skill.trim()),
          publish_date: null,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      setSubmitStatus("success");
      formMethods.reset();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-secondary dark:bg-secondary-dark rounded-xl shadow-lg p-6 max-w-2xl w-full border border-theme-border/30 dark:border-theme-border-dark/30 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-theme-title dark:text-theme-title-dark">
            Join as Builder
          </h2>
          <button
            onClick={onClose}
            className="text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark"
             aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
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
               Thank you for your submission! Your profile is pending approval.
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
                 name="name"
                 placeholder="Your Full Name"
                 options={{ required: true }}
               />
               <Select
                 label="Main Expertise"
                 name="main_expertise"
                 options={{ required: true }}
                 selectOptions={[{ id: "", name: "Select expertise" }, ...EXPERTISE_OPTIONS]}
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Availability"
                name="availability"
                options={{ required: true }}
                selectOptions={[{ id: "", name: "Select availability" }, ...AVAILABILITY_OPTIONS]}
              />
              <Input
                label="Profile Image URL"
                name="profile_image_url"
                type="url"
                placeholder="https://example.com/your-image.jpg"
                options={{}}
              />
            </div>

            <Textarea
              label="Description"
              name="description"
              placeholder="Tell us about yourself and your experience..."
              options={{ required: true }}
            />

            <Input
              label="Skills"
              name="skills"
              placeholder="e.g., React, Node.js, Smart Contracts (comma-separated)"
              options={{ required: true }}
            />
             <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 ml-1">Comma-separated list</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Years of Experience (Optional)"
                name="experience"
                type="number"
                placeholder="e.g., 5"
                options={{ min: 0 }}
              />
               <Input
                 label="Interests / Areas to Contribute (Optional)"
                 name="interests"
                 placeholder="e.g., DeFi, NFTs, Tooling"
                 options={{}}
               />
            </div>

            <h3 className="text-lg font-medium text-theme-text dark:text-theme-text-dark pt-2 border-t border-theme-border/30 dark:border-theme-border-dark/30">
              Social Links (Optional)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="GitHub URL"
                name="github_url"
                type="url"
                placeholder="https://github.com/yourusername"
                options={{}}
              />
              <Input
                label="Twitter URL"
                name="twitter_url"
                type="url"
                placeholder="https://twitter.com/yourusername"
                options={{}}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input
                 label="Telegram URL/Handle"
                 name="telegram_url"
                 placeholder="https://t.me/yourusername or @yourusername"
                 options={{}}
               />
               <Input
                 label="Personal Website/Portfolio URL"
                 name="website_url"
                 type="url"
                 placeholder="https://yourwebsite.com"
                 options={{}}
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
                label={isSubmitting ? "Submitting..." : "Submit Profile"}
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
