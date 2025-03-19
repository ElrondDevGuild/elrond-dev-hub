import { useState } from "react";
import CategoryBadge from "./shared/CategoryBadge";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SubmitTeamFinderProps {
  onClose: () => void;
}

const EXPERTISE_OPTIONS = [
  // Development
  "Smart Contract Development",
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "DevOps & Infrastructure",
  "Security & Auditing",
  "Testing & QA",
  "Mobile Development",

  // Design & UX
  "UI/UX Design",
  "Graphic Design",
  "Product Design",

  // Business & Community
  "Community Management",
  "Marketing & Growth",
  "Business Development",
  "Project Management",
  "Technical Writing",
  "Documentation",

  // Blockchain Specific
  "Blockchain Architecture",
  "Token Economics",
  "DeFi Development",
  "NFT Development",
  "GameFi Development",
  "Cross-chain Integration",

  // Other
  "Research & Development",
  "Technical Support",
  "Other",
];

const AVAILABILITY_OPTIONS = [
  "Full-time Available",
  "Part-time (20+ hours/week)",
  "Part-time (10-20 hours/week)",
  "Part-time (5-10 hours/week)",
  "Few hours per week",
  "Available for specific projects",
  "Currently busy",
  "Available for mentoring only",
];

export default function SubmitTeamFinder({ onClose }: SubmitTeamFinderProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    profile_image_url: "",
    skills: [] as string[],
    main_expertise: "",
    availability: "",
    experience: "",
    interests: "",
    github_url: "",
    twitter_url: "",
    telegram_url: "",
    website_url: "",
  });
  const [newSkill, setNewSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("tf_developers").insert([
        {
          ...formData,
          publish_date: null,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      setSubmitStatus("success");
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
        className="bg-secondary dark:bg-secondary-dark rounded-xl shadow-lg p-6 max-w-2xl w-full border border-theme-border/30 dark:border-theme-border-dark/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-theme-title dark:text-theme-title-dark">
            Join as Builder
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
            Thank you for your submission! Your profile is pending approval.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Main Expertise
                </label>
                <select
                  required
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.main_expertise}
                  onChange={(e) =>
                    setFormData({ ...formData, main_expertise: e.target.value })
                  }
                >
                  <option value="">Select expertise</option>
                  {EXPERTISE_OPTIONS.map((expertise) => (
                    <option key={expertise} value={expertise}>
                      {expertise}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Availability
                </label>
                <select
                  required
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.availability}
                  onChange={(e) =>
                    setFormData({ ...formData, availability: e.target.value })
                  }
                >
                  <option value="">Select availability</option>
                  {AVAILABILITY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.profile_image_url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile_image_url: e.target.value,
                    })
                  }
                  placeholder="https://example.com/your-image.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                Description
              </label>
              <textarea
                required
                rows={3}
                className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Tell us about yourself and your experience..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-medium text-theme-text dark:text-theme-text-dark flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleAddSkill}
                placeholder="Type a skill and press Enter"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                Experience
              </label>
              <input
                type="text"
                required
                className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                placeholder="e.g., 5 years of experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                Interests
              </label>
              <input
                type="text"
                required
                className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                value={formData.interests}
                onChange={(e) =>
                  setFormData({ ...formData, interests: e.target.value })
                }
                placeholder="e.g., DeFi, NFTs, Gaming"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.github_url}
                  onChange={(e) =>
                    setFormData({ ...formData, github_url: e.target.value })
                  }
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Twitter URL
                </label>
                <input
                  type="url"
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.twitter_url}
                  onChange={(e) =>
                    setFormData({ ...formData, twitter_url: e.target.value })
                  }
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1">
                  Telegram URL
                </label>
                <input
                  type="url"
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  value={formData.telegram_url}
                  onChange={(e) =>
                    setFormData({ ...formData, telegram_url: e.target.value })
                  }
                  placeholder="https://t.me/username"
                />
              </div>

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
                  placeholder="https://your-website.com"
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
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
