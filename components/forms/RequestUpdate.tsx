import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { FiSend, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../shared/Button";

interface RequestUpdateProps {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RequestUpdate({ projectId, projectTitle, onClose }: RequestUpdateProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("decenter")
        .update({
          last_log: message,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);

      if (error) throw error;

      setSubmitStatus("success");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error updating project:", error);
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
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-secondary dark:bg-secondary-dark rounded-xl shadow-lg p-6 max-w-lg w-full border border-theme-border/30 dark:border-theme-border-dark/30"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-theme-title dark:text-theme-title-dark">
            Request Project Update
          </h2>
          <button
            onClick={onClose}
            className="text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <p className="text-md text-theme-text dark:text-theme-text-dark mb-6">
          Project: <span className="font-medium">{projectTitle}</span>
        </p>

        <AnimatePresence>
          {submitStatus === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-green-600 dark:text-green-400"
            >
              Update sent successfully!
            </motion.div>
          ) : submitStatus === "error" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-red-600 dark:text-red-400"
            >
              Failed to send update. Please try again.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-theme-text dark:text-theme-text-dark mb-1"
                >
                  Update Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full rounded-md border border-theme-border dark:border-theme-border-dark bg-white dark:bg-gray-800 text-theme-text dark:text-theme-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                  placeholder="Enter your update message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-theme-text dark:text-theme-text-dark bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <Button
                  label={isSubmitting ? "Sending..." : "Send Update"}
                  icon={FiSend}
                  disabled={isSubmitting || !message.trim()}
                />
              </div>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 