import { FormProvider, useForm } from 'react-hook-form';

import Layout from '../components/Layout';
import Button from '../components/shared/Button';
import Input from '../components/shared/form/Input';
import Select from '../components/shared/form/Select';
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
      <div className="px-16 text-theme-text dark:text-theme-text-dark rounded-md">
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
            <form onSubmit={handleSubmit(submitResource)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Input
                  label="Title"
                  name="title"
                  placeholder="My awesome article"
                  type="text"
                  options={{ required: true }}
                />
              </div>

              <div>
                <Input
                  label="Content URL"
                  name="url"
                  placeholder="https://exmaple.com"
                  type="url"
                  options={{ required: true }}
                />
              </div>

              <div>
                <Input label="Author" name="author" placeholder="John Doe" type="text" options={{ required: true }} />
              </div>

              <div>
                <Input label="Wallet address" name="wallet" placeholder="erd123..." type="text" />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  label="Description"
                  name="description"
                  placeholder="My awesome description"
                  options={{ required: true }}
                />
              </div>

              <div>
                <Select name="category" options={{ required: true }} label="Category" />
              </div>

              <div>
                <Input label="tags" name="tags" placeholder="elrond,blockchain" type="text" />
              </div>

              <div>
                <Button label="Submit" />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Layout>
  );
}
