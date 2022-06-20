import { FormProvider, useForm } from 'react-hook-form';

import Layout from '../components/Layout';
import Input from '../components/shared/form/Input';
import Textarea from '../components/shared/form/Textarea';

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
  const { handleSubmit, setValue } = formMethods;

  const submitResource = (formData: ISubmitResource) => {
    console.log(formData);
  };

  return (
    <Layout hideRightBar={true}>
      <div className="bg-white dark:bg-secondary-dark-lighter p-6 text-theme-text dark:text-theme-text-dark rounded-md">
        <div className="flex flex-col">
          <h1 className="font-semibold text-4xl text-theme-title dark:text-theme-title-dark mb-4">
            Submit new content
          </h1>
          <p className="max-w-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto adipisci sit, consequatur ab nostrum,
            aperiam eaque unde debitis ipsam officiis labore quo laborum voluptatibus ducimus.
          </p>
        </div>

        <div className="mt-10">
          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(submitResource)} className="lg:gap-x-12 xl:gap-x-16">
              <Input
                label="Title"
                name="title"
                placeholder="My awesome article"
                type="text"
                options={{ required: true }}
              />

              <Textarea
                label="Description"
                name="description"
                placeholder="My awesome description"
                options={{ required: true }}
              />
            </form>
          </FormProvider>
        </div>
      </div>
    </Layout>
  );
}
