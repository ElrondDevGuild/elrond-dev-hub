import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import Input from "../shared/form/Input";
import Select from "../shared/form/Select";
import Textarea from "../shared/form/Textarea";
import { IOption } from "../shared/form/SelectElement";
import Button from "../shared/Button";
import { FiX, FiSend } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

interface ISubmitProject {
  title: string;
  description: string;
  category: string;
  team: string;
  status: string;
  open_source: string;
  estimated_completion: string;
  link: string;
  assignees: string;
}

interface SubmitDecenterProps {
  onClose: () => void;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const categories: IOption[] = [
  { id: "1", name: "Smart Contracts" },
  { id: "2", name: "DApps" },
  { id: "3", name: "Tools" },
  { id: "4", name: "Infrastructure" },
  { id: "5", name: "Gaming" },
  { id: "6", name: "DeFi" },
  { id: "7", name: "NFTs" },
  { id: "8", name: "AI" },
  { id: "9", name: "Mobile" },
  { id: "10", name: "Web" },
];

const statusOptions: IOption[] = [
  { id: "1", name: "In Progress" },
  { id: "2", name: "Live" },
  { id: "3", name: "Planning" },
];

const openSourceOptions: IOption[] = [
  { id: "1", name: "Yes" },
  { id: "2", name: "No" },
];

export default function SubmitDecenter({ onClose }: SubmitDecenterProps) {
  const formMethods = useForm<ISubmitProject>();
  const { handleSubmit } = formMethods;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const router = useRouter();

  const submitProject = async (formData: ISubmitProject) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const { error } = await supabase.from("decenter").insert([
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          team: formData.team,
          status: formData.status,
          open_source: formData.open_source,
          estimated_completion: formData.estimated_completion,
          link: formData.link,
          assignees: formData.assignees,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setSubmitStatus("success");
      formMethods.reset();
      setTimeout(() => { onClose(); }, 2000);

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
            Submit New Project
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
              Project submitted successfully! Thank you.
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
          <form onSubmit={handleSubmit(submitProject)} className="space-y-6 mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Fields marked with <span className="text-red-500">*</span> are required
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Project title"
                  name="title"
                  placeholder="My awesome project"
                  type="text"
                  options={{ required: true }}
                />
              </div>

              <div>
                <Input
                  label="Team name"
                  name="team"
                  placeholder="My Team"
                  type="text"
                  options={{ required: true }}
                />
              </div>
            </div>

            <div>
              <Textarea
                label="Description"
                name="description"
                placeholder="Describe your project..."
                options={{ required: true }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Category"
                  name="category"
                  options={{ required: true }}
                  selectOptions={categories}
                />
              </div>

              <div>
                <Select
                  label="Status"
                  name="status"
                  options={{ required: true }}
                  selectOptions={statusOptions}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Open source"
                  name="open_source"
                  options={{ required: true }}
                  selectOptions={openSourceOptions}
                />
              </div>

              <div>
                <Input
                  label="Estimated completion"
                  name="estimated_completion"
                  placeholder="2024-12-31"
                  type="date"
                  options={{ required: true }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Project link"
                  name="link"
                  placeholder="https://github.com/..."
                  type="url"
                />
              </div>

              <div>
                <Input
                  label="Assignees"
                  name="assignees"
                  placeholder="John Doe, Jane Smith"
                  type="text"
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
