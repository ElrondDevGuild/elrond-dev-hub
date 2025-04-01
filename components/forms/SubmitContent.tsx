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
  const [submitting, setSubmitting] = useState(false);
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

    try {
      setSubmitting(true);
      const { data } = await api.post("resources", { ...formData, tags });
      formMethods.reset();

      router.push(thankYouPath);
    } catch (e) {
      let errMessage: string;
      if (axios.isAxiosError(e) && e.response?.status === 422) {
        // @ts-ignore
        errMessage = e.response.data.error;
      } else {
        errMessage = "Something went wrong. Please try again in a few moments";
      }
      alert(errMessage);
    } finally {
      setSubmitting(false);
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

      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(submitResource)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="CONTENT URL"
                name="resource_url"
                placeholder="https://example.com"
                type="url"
                options={{ required: true }}
              />
            </div>

            <div>
              <Input
                label="TITLE"
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
                label="AUTHOR"
                name="author"
                placeholder="John Doe"
                type="text"
                options={{ required: true }}
              />
            </div>

            <div>
              <Input
                label="WALLET ADDRESS"
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
              label="DESCRIPTION"
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
                label="CATEGORY"
                name="category_id"
                options={{ required: true }}
                selectOptions={categories}
              />
            </div>

            <div>
              <Input
                label="TAGS"
                name="tags"
                placeholder="multiversx, blockchain"
                type="text"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary dark:bg-primary-dark rounded-md hover:bg-primary-dark dark:hover:bg-primary disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Content"}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
} 