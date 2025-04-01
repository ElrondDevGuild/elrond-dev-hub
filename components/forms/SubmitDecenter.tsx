import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import Input from "../shared/form/Input";
import Select from "../shared/form/Select";
import Textarea from "../shared/form/Textarea";
import { IOption } from "../shared/form/SelectElement";

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
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const submitProject = async (formData: ISubmitProject) => {
    try {
      setSubmitting(true);
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

      formMethods.reset();
      onClose();
      router.push("/thank-you");
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-secondary dark:bg-secondary-dark rounded-xl shadow-lg p-6 max-w-2xl w-full border border-theme-border/30 dark:border-theme-border-dark/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-theme-title dark:text-theme-title-dark">
            Submit New Project
          </h2>
          <button
            onClick={onClose}
            className="text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark"
          >
            ✕
          </button>
        </div>

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(submitProject)} className="space-y-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Fields marked with <span className="text-red-500">*</span> are required
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="PROJECT TITLE"
                  name="title"
                  placeholder="My awesome project"
                  type="text"
                  options={{ required: true }}
                />
              </div>

              <div>
                <Input
                  label="TEAM NAME"
                  name="team"
                  placeholder="My Team"
                  type="text"
                  options={{ required: true }}
                />
              </div>
            </div>

            <div>
              <Textarea
                label="DESCRIPTION"
                name="description"
                placeholder="Describe your project..."
                options={{ required: true }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="CATEGORY"
                  name="category"
                  options={{ required: true }}
                  selectOptions={categories}
                />
              </div>

              <div>
                <Select
                  label="STATUS"
                  name="status"
                  options={{ required: true }}
                  selectOptions={statusOptions}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="OPEN SOURCE"
                  name="open_source"
                  options={{ required: true }}
                  selectOptions={openSourceOptions}
                />
              </div>

              <div>
                <Input
                  label="ESTIMATED COMPLETION"
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
                  label="PROJECT LINK"
                  name="link"
                  placeholder="https://github.com/..."
                  type="url"
                />
              </div>

              <div>
                <Input
                  label="ASSIGNEES"
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
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-white bg-primary dark:bg-primary-dark rounded-md hover:bg-primary-dark dark:hover:bg-primary disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Project"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
