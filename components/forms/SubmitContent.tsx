import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Input from "../shared/form/Input";
import Select from "../shared/form/Select";
import { IOption } from "../shared/form/SelectElement";
import Textarea from "../shared/form/Textarea";
import { Category } from "../../types/supabase";
import { api } from "../../utils/api";
import { thankYouPath } from "../../utils/routes";
import Button from "../shared/Button";
import { FiSend } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

interface ISubmitResource {
  title: string;
  author: string;
  url: string;
  description: string;
  category: string;
  tags?: string;
  wallet?: string;
}

export default function SubmitContent() {
  const formMethods = useForm<ISubmitResource>();
  const [categories, setCategories] = useState<Array<IOption>>([]);
  const { handleSubmit, setValue } = formMethods;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("categories");
        setCategories(
          data.map((category: Category) => ({
            id: category.id,
            name: category.title,
          }))
        );
      } catch (e) {}
    };

    fetchCategories();
  }, []);

  const submitResource = async (formData: ISubmitResource) => {
    const tags = formData.tags?.split(",");

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitErrorMsg("");

    try {
      const { data } = await api.post("resources", { ...formData, tags });
      setSubmitStatus("success");
      formMethods.reset();

    } catch (e) {
      let errMessage: string;
      if (axios.isAxiosError(e) && e.response?.status === 422) {
        // @ts-ignore
        errMessage = e.response.data.error;
      } else {
        errMessage = "Something went wrong. Please try again in a few moments";
      }
      setSubmitErrorMsg(errMessage);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-secondary dark:bg-secondary-dark p-8 rounded-xl shadow-lg border border-theme-border/30 dark:border-theme-border-dark/30">
      <div className="flex flex-col mb-8">
        <h1 className="font-bold text-2xl text-theme-title dark:text-theme-title-dark mb-4">
          Submit New Content
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Share new content with other MultiversX Devs. Fields marked with <span className="text-red-500">*</span> are required.
          Submissions will be manually reviewed before publishing.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submitStatus === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center text-green-600 dark:text-green-400 p-4 bg-green-100 dark:bg-green-900/50 rounded-md mb-6"
          >
            Content submitted successfully! Thank you for your contribution.
          </motion.div>
        ) : submitStatus === "error" ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/50 rounded-md mb-6"
          >
            {submitErrorMsg || "Submission failed. Please try again."}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(submitResource)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Content URL"
                name="resource_url"
                placeholder="https://example.com"
                type="url"
                options={{ required: true }}
              />
            </div>

            <div>
              <Input
                label="Title"
                name="title"
                placeholder="My awesome resource"
                type="text"
                options={{ required: true }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Author"
                name="author"
                placeholder="John Doe"
                type="text"
                options={{ required: true }}
              />
            </div>

            <div>
              <Input
                label="Wallet address"
                name="curator_address"
                placeholder="erd123..."
                type="text"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                We will use this to link the resource to your account later
              </p>
            </div>
          </div>

          <div>
            <Textarea
              label="Description"
              name="description"
              placeholder="Describe your resource in 30-256 characters..."
              options={{ required: true, maxLength: 256, minLength: 30 }}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
              30-256 characters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Select
                label="Category"
                name="category_id"
                options={{ required: true }}
                selectOptions={categories}
              />
            </div>

            <div>
              <Input
                label="Tags"
                name="tags"
                placeholder="multiversx, blockchain"
                type="text"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              label={isSubmitting ? "Submitting..." : "Submit Content"}
              icon={FiSend}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
} 