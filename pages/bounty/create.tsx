import RequiresAuth from "../../components/RequiresAuth";
import {NextSeo} from "next-seo";
import Layout from "../../components/Layout";
import {FormProvider, useForm} from 'react-hook-form';
import Input from "../../components/shared/form/Input";
import Select from "../../components/shared/form/Select";
import {IOption} from "../../components/shared/form/SelectElement";


type FormValues = {}

const typeOptions: IOption[] = [
    {id: "single_worker", name: "Single Worker"},
    {id: "many_workers", name: "Many Workers"},
];
const permissionOptions: IOption[] = [
    {id: false, name: "Permissionless"},
    {id: true, name: "Require Permission"}
];

const experienceOptions: IOption[] = [
    {id: "beginner", name: "Beginner"},
    {id: "intermediate", name: "Intermediate"},
    {id: "experienced", name: "Experienced"},
];

const issueTypeOptions: IOption[] = [
    {id: "bug", name: "Bug"},
    {id: "feature", name: "Feature"},
    {id: "design", name: "Design"},
    {id: "other", name: "Other"},
];
export default function Create() {
    const formMethods = useForm<FormValues>();
    const {handleSubmit, setValue} = formMethods;

    const submitBounty = async (formData: FormValues) => {


    };

    return (
        <Layout hideRightBar={true}>
            <RequiresAuth>
                <NextSeo title="Submit bounty"/>
                <div className="lg:px-16 text-theme-text dark:text-theme-text-dark rounded-md">
                    <div className="flex flex-col">
                        <h1 className="font-semibold text-4xl text-theme-title dark:text-theme-title-dark mb-4">
                            Add Bounty
                        </h1>
                        <p className="max-w-xl">
                            Add a new bounty to the platform. Submissions are automatically
                            published.
                        </p>
                    </div>
                    <div className="mt-10">
                        <FormProvider {...formMethods}>
                            <form onSubmit={submitBounty}
                                  className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Title*"
                                        name="title"
                                        placeholder="My awesome resource"
                                        type="text"
                                        options={{required: true}}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Input label="tags" name="tags" placeholder="elrond,blockchain"
                                           type="text"/>
                                    <p className="font-medium text-xs text-theme-border dark:text-theme-border-dark mt-1">
                                        Tags will improve content discovery
                                    </p>
                                </div>
                                <div>
                                    <Select
                                        name="project_type"
                                        options={{required: true}}
                                        label="Type*"
                                        selectOptions={typeOptions}
                                    />
                                </div>
                                <div>
                                    <Select
                                        name="requires_work_permission"
                                        options={{required: true}}
                                        label="Permissions*"
                                        selectOptions={permissionOptions}
                                    />
                                </div>
                                <div>
                                    <Select
                                        name="experience_level"
                                        options={{required: true}}
                                        label="Experience Level*"
                                        selectOptions={experienceOptions}
                                    />
                                </div>
                                <div>
                                    <Select
                                        name="issue_type"
                                        options={{required: true}}
                                        label="Issue type*"
                                        selectOptions={issueTypeOptions}
                                    />
                                </div>

                            </form>
                        </FormProvider>
                    </div>
                </div>
            </RequiresAuth>
        </Layout>
    );
};