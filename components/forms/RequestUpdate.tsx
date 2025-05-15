import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { FiSend, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../shared/Button";
import Textarea from "../shared/form/Textarea";
import { useForm, FormProvider } from "react-hook-form";

interface RequestUpdateProps {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
}

interface IRequestUpdateForm {
  message: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RequestUpdate({ projectId, projectTitle, onClose }: RequestUpdateProps) {
  const formMethods = useForm<IRequestUpdateForm>();
  const { handleSubmit } = formMethods;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const onSubmit = async (data: IRequestUpdateForm) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const { error } = await supabase
        .from("x_decenter")
        .update({
          last_log: data.message,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);

      if (error) throw error;

      setSubmitStatus("success");
      formMethods.reset();
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
      <div
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
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <p className="text-md text-theme-text dark:text-theme-text-dark mb-6">
          Project: <span className="font-medium">{projectTitle}</span>
        </p>

        <AnimatePresence mode="wait">
          {submitStatus === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-green-600 dark:text-green-400 p-4 bg-green-100 dark:bg-green-900/50 rounded-md mb-4"
            >
              Update sent successfully!
            </motion.div>
          ) : submitStatus === "error" ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/50 rounded-md mb-4"
            >
              Failed to send update. Please try again.
            </motion.div>
          ) : null }
        </AnimatePresence>

        <FormProvider {...formMethods}>
           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
             <Textarea
                label="Update Message"
                name="message"
                placeholder="Enter your update message here..."
                options={{ required: "Update message cannot be empty." }}
             />

             <div className="flex justify-end space-x-3 pt-4">
               <button
                 type="button"
                 onClick={onClose}
                 className="px-4 py-2 text-sm font-medium text-theme-text dark:text-theme-text-dark bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
               >
                 Cancel
               </button>
               <Button
                 label={isSubmitting ? "Sending..." : "Send Update"}
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