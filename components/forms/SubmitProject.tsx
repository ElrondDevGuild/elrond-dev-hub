import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SubmitProjectProps {
  onClose: () => void;
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

export default function SubmitProject({ onClose }: SubmitProjectProps) {
  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    category: "",
    development_status: "",
    github_url: "",
    website_url: "",
    demo_url: "",
    team_members: [] as string[],
    contact_email: "",
    telegram_handle: "",
    twitter_handle: "",
    thumbnail_url: "",
  });

  const [newTeamMember, setNewTeamMember] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleAddTeamMember = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTeamMember.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        team_members: [...prev.team_members, newTeamMember.trim()],
      }));
      setNewTeamMember("");
    }
  };

  const removeTeamMember = (member: string) => {
    setFormData((prev) => ({
      ...prev,
      team_members: prev.team_members.filter((m) => m !== member),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Campi obbligatori
      const mandatoryFields = {
        url: formData.github_url,
        project_name: formData.project_name,
        team_name: formData.team_members[0] || "",
        category: formData.category,
        status: "pending",
        publish_date: null, // Sarà impostato dall'admin quando approva il progetto
      };

      // Campi opzionali
      const optionalFields = {
        description: formData.description || null,
        website_url: formData.website_url || null,
        demo_url: formData.demo_url || null,
        contact_email: formData.contact_email || null,
        telegram_handle: formData.telegram_handle || null,
        twitter_handle: formData.twitter_handle || null,
        development_status: formData.development_status || null,
        thumbnail_url: formData.thumbnail_url || null,
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
        className="bg-secondary dark:bg-secondary-dark rounded-xl shadow-lg p-6 max-w-2xl w-full border border-theme-border/30 dark:border-theme-border-dark/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-theme-title dark:text-theme-title-dark">
            Submit Project for Monthly Leaderboard
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
            Thank you for your submission! Your project will be reviewed
            shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Fields marked with <span className="text-red-500">*</span> are
              required
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  GitHub URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.github_url}
                  onChange={(e) =>
                    setFormData({ ...formData, github_url: e.target.value })
                  }
                  placeholder="https://github.com/username/project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.project_name}
                  onChange={(e) =>
                    setFormData({ ...formData, project_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.team_members[0] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      team_members: [e.target.value],
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="">Select category</option>
                  {PROJECT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                Project Description
              </label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your project and its main features..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Development Status
                </label>
                <select
                  required
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.development_status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      development_status: e.target.value,
                    })
                  }
                >
                  <option value="">Select status</option>
                  {DEVELOPMENT_STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.thumbnail_url}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail_url: e.target.value })
                  }
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.website_url}
                  onChange={(e) =>
                    setFormData({ ...formData, website_url: e.target.value })
                  }
                  placeholder="www.your-project.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Demo URL
                </label>
                <input
                  type="url"
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.demo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, demo_url: e.target.value })
                  }
                  placeholder="demo.your-project.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.contact_email}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_email: e.target.value })
                  }
                  placeholder="contact@your-project.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Telegram Handle
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.telegram_handle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      telegram_handle: e.target.value,
                    })
                  }
                  placeholder="t.me/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Twitter Handle
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.twitter_handle}
                  onChange={(e) =>
                    setFormData({ ...formData, twitter_handle: e.target.value })
                  }
                  placeholder="x.com/username"
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
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-primary dark:bg-primary-dark rounded-md hover:bg-primary-dark dark:hover:bg-primary disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Project"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
