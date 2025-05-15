import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useForm, FormProvider } from "react-hook-form";
import Input from "../shared/form/Input";
import Select from "../shared/form/Select";
import Textarea from "../shared/form/Textarea";
import Button from "../shared/Button";
import { FiX, FiSend, FiInfo } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SubmitProjectProps {
  onClose: () => void;
}

interface ILeaderboardProjectForm {
  project_name: string;
  description: string;
  category: string;
  development_status: string;
  github_url: string;
  website_url: string;
  demo_url: string;
  team_name: string;
  contact_email: string;
  telegram_handle: string;
  twitter_handle: string;
  thumbnail_url: string;
}

const PROJECT_CATEGORIES = [
  "DeFi",
  "NFT",
  "Gaming",
  "Infrastructure",
  "DAO",
  "Social",
  "Tools",
  "Education",
  "Other",
];

const DEVELOPMENT_STATUS = [
  "Concept",
  "In Development",
  "Beta",
  "Live",
  "Completed",
];

// Helper component to display field description text
const HelperText = ({ text }: { text: string }) => (
  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{text}</p>
);

export default function SubmitProject({ onClose }: SubmitProjectProps) {
  const formMethods = useForm<ILeaderboardProjectForm>();
  const { handleSubmit, register } = formMethods;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const onSubmit = async (data: ILeaderboardProjectForm) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const mandatoryFields = {
        url: data.github_url,
        project_name: data.project_name,
        team_name: data.team_name,
        category: data.category,
        published_at: null,
      };

      const optionalFields = {
        description: data.description || null,
        website_url: data.website_url || null,
        demo_url: data.demo_url || null,
        contact_email: data.contact_email || null,
        telegram_handle: data.telegram_handle || null,
        twitter_handle: data.twitter_handle || null,
        development_status: data.development_status || null,
        thumbnail_url: data.thumbnail_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("leaderboard_projects").insert([
        {
          ...mandatoryFields,
          ...optionalFields,
        },
      ]);

      if (error) throw error;
      setSubmitStatus("success");
      formMethods.reset();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting project:", error);
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
            Submit Project for Monthly Leaderboard
          </h2>
          <button
            onClick={onClose}
            className="text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 text-sm text-blue-800 dark:text-blue-300 flex items-start">
          <FiInfo className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="mb-1"><strong>Who can participate?</strong> Everyone!</p>
            <p>Whether you&apos;re an individual developer or a large team, as long as you&apos;re building on MultiversX, you&apos;re eligible to earn 15 EGLD. Just submit your public GitHub repository and keep committing code throughout the month.</p>
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
              Thank you for your submission! Your project will be reviewed shortly.
            </motion.div>
          ) : submitStatus === "error" ? (
            <motion.div
               key="error"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="text-center text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/50 rounded-md mb-4"
            >
              Submission failed. Please check your details and try again.
            </motion.div>
          ) : null}
        </AnimatePresence>

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Fields marked with <span className="text-red-500">*</span> are required
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="GitHub URL"
                  name="github_url"
                  type="url"
                  placeholder="https://github.com/username/project"
                  options={{ required: true }}
                />
                <HelperText text="Your public repository URL" />
              </div>
              <div>
                <Input
                  label="Project Name"
                  name="project_name"
                  type="text"
                  placeholder="My Awesome Project"
                  options={{ required: true }}
                />
                <HelperText text="The name of your MultiversX project" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Developer/Team Name"
                  name="team_name"
                  type="text"
                  placeholder="John Doe or Team Awesome"
                  options={{ required: true }}
                />
                <HelperText text="Your name or your team&apos;s name" />
              </div>
              <div>
                <Select
                  label="Category"
                  name="category"
                  options={{ required: true }}
                  selectOptions={[{ id: "", name: "Select category" }, ...PROJECT_CATEGORIES.map(cat => ({ id: cat, name: cat }))]}
                />
                <HelperText text="Select the most relevant category" />
              </div>
            </div>

            <div>
              <Textarea
                label="Project Description"
                name="description"
                placeholder="Describe your project and its main features..."
                options={{ required: true }}
              />
              <HelperText text="A brief description of what your project does and its key features" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Development Status"
                  name="development_status"
                  options={{ required: true }}
                  selectOptions={[{ id: "", name: "Select status" }, ...DEVELOPMENT_STATUS.map(status => ({ id: status, name: status }))]}
                />
                <HelperText text="Current stage of your project" />
              </div>
              <div>
                <Input
                  label="Website URL"
                  name="website_url"
                  type="url"
                  placeholder="https://my-project.com"
                  options={{}}
                />
                <HelperText text="Optional: Your project&apos;s website" />
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Demo URL"
                  name="demo_url"
                  type="url"
                  placeholder="https://demo.my-project.com"
                  options={{}}
                />
                <HelperText text="Optional: Link to a live demo" />
              </div>
              <div>
                <Input
                  label="Thumbnail URL"
                  name="thumbnail_url"
                  type="url"
                  placeholder="https://example.com/thumbnail.png"
                  options={{}}
                />
                <HelperText text="Optional: Image URL for your project" />
              </div>
             </div>

            <h3 className="text-lg font-medium text-theme-text dark:text-theme-text-dark pt-2 border-t border-theme-border/30 dark:border-theme-border-dark/30">
              Contact Information (Optional)
            </h3>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Input
                  label="Contact Email"
                  name="contact_email"
                  type="email"
                  placeholder="contact@example.com"
                  options={{
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                  }}
                />
                <HelperText text="For updates about your submission" />
              </div>
              <div>
                <Input
                  label="Telegram Handle"
                  name="telegram_handle"
                  type="text"
                  placeholder="@your_handle"
                  options={{}}
                />
                <HelperText text="Optional contact method" />
              </div>
              <div>
                <Input
                  label="Twitter Handle"
                  name="twitter_handle"
                  type="text"
                  placeholder="@your_handle"
                  options={{}}
                />
                <HelperText text="Optional contact method" />
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
                label={isSubmitting ? "Submitting..." : "Submit Project"}
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
