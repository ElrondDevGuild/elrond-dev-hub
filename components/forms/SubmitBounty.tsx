import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface SubmitBountyProps {
  onClose: () => void;
}

export default function SubmitBounty({ onClose }: SubmitBountyProps) {
  const [formData, setFormData] = useState({
    company_name: "",
    company_website: "",
    title: "",
    description: "",
    bounty_amount: "",
    estimated_duration: "",
    category: "",
    difficulty_level: "",
    skills_needed: "",
    link: "",
    deadline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("x_bounties").insert([
        {
          ...formData,
          status: "Pending Review",
          skills_needed: formData.skills_needed.split(",").map((skill) => skill.trim()),
          requirements: [],
          published_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      setSubmitStatus("success");
      setFormData({
        company_name: "",
        company_website: "",
        title: "",
        description: "",
        bounty_amount: "",
        estimated_duration: "",
        category: "",
        difficulty_level: "",
        skills_needed: "",
        link: "",
        deadline: "",
      });
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-secondary dark:bg-secondary-dark rounded-xl shadow-lg p-6 max-w-2xl w-full border border-theme-border/30 dark:border-theme-border-dark/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-theme-title dark:text-theme-title-dark">
          Submit a Bounty
        </h2>
        <button
          onClick={onClose}
          className="text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark"
        >
          ✕
        </button>
      </div>

      {submitStatus === "success" ? (
        <div className="text-green-600 dark:text-green-400">
          Thank you for your submission! Your bounty will be reviewed and published shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                placeholder="Your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                Company Website <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="company_website"
                value={formData.company_website}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                placeholder="https://your-company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
              Bounty Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
              placeholder="e.g., Build a DeFi Dashboard"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
              placeholder="Describe the bounty requirements and deliverables..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                Bounty Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bounty_amount"
                value={formData.bounty_amount}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                placeholder="e.g., 5000 EGLD"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                Estimated Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="estimated_duration"
                value={formData.estimated_duration}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                placeholder="e.g., 2 weeks"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
              >
                <option value="">Select category</option>
                <option value="DeFi">DeFi</option>
                <option value="NFT">NFT</option>
                <option value="Gaming">Gaming</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="DAO">DAO</option>
                <option value="Social">Social</option>
                <option value="Tools">Tools</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                Difficulty Level <span className="text-red-500">*</span>
              </label>
              <select
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
              Required Skills <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="skills_needed"
              value={formData.skills_needed}
              onChange={handleInputChange}
              required
              className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
              placeholder="e.g., React, Solidity, Smart Contracts"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
              Application Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              required
              className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
              placeholder="https://your-application-form.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
              Deadline (Optional)
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary dark:bg-primary-dark rounded-md hover:bg-primary-dark dark:hover:bg-primary disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Bounty"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 