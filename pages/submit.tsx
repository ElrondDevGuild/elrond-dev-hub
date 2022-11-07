import axios from 'axios';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Layout from '../components/Layout';
import Button from '../components/shared/Button';
import Input from '../components/shared/form/Input';
import Select from '../components/shared/form/Select';
import { IOption } from '../components/shared/form/SelectElement';
import Textarea from '../components/shared/form/Textarea';
import { Category } from '../types/supabase';
import { api } from '../utils/api';
import { thankYouPath } from '../utils/routes';

interface ISubmitResource {
  title: string;
  author: string;
  url: string;
  description: string;
  category: string;
  tags?: string;
  wallet?: string;
}

export default function Submit() {
  const formMethods = useForm<ISubmitResource>();
  const [categories, setCategories] = useState<Array<IOption>>([]);
  const { handleSubmit, setValue } = formMethods;
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("categories");
        setCategories(data.map((category: Category) => ({ id: category.id, name: category.title })));
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
    <Layout hideRightBar={true}>
      <NextSeo title="Submit content" />
      <div className="lg:px-16 text-theme-text dark:text-theme-text-dark rounded-md">
        <div className="flex flex-col">
          <h1 className="font-semibold text-4xl text-theme-title dark:text-theme-title-dark mb-4">
            Submit new content
          </h1>
          <p className="max-w-xl">
            Share new content with other MultiversX Devs. Submissions will be manually reviewed before publishing them
            to the platform.
          </p>
        </div>

        <div className="mt-10">
          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(submitResource)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Input
                  label="Content URL*"
                  name="resource_url"
                  placeholder="https://exmaple.com"
                  type="url"
                  options={{ required: true }}
                />
              </div>

              <div>
                <Input
                  label="Title*"
                  name="title"
                  placeholder="My awesome resource"
                  type="text"
                  options={{ required: true }}
                />
              </div>

              <div>
                <Input label="Author*" name="author" placeholder="John Doe" type="text" options={{ required: true }} />
              </div>

              <div>
                <Input label="Wallet address" name="curator_address" placeholder="erd123..." type="text" />
                <p className="font-medium text-xs text-theme-border dark:text-theme-border-dark mt-1">
                  We will use this to link the resource to your account later
                </p>
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Description*"
                  name="description"
                  placeholder="My awesome description"
                  options={{ required: true, maxLength: 256, minLength: 30 }}
                />
                <span className="font-medium text-xs text-theme-border dark:text-theme-border-dark mt-1">
                  30-256 characters
                </span>
              </div>

              <div>
                <Select name="category_id" options={{ required: true }} label="Category*" selectOptions={categories} />
              </div>

              <div>
                <Input label="tags" name="tags" placeholder="multiversx,blockchain" type="text" />
              </div>

              <div>
                <Button label={submitting ? "Loading..." : "Submit"} disabled={submitting} />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Layout>
  );
}
