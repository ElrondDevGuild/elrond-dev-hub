import RequiresAuth from "../../components/RequiresAuth";
import {NextSeo} from "next-seo";
import Layout from "../../components/Layout";
import {FormProvider, useForm} from 'react-hook-form';
import Input from "../../components/shared/form/Input";
import Select from "../../components/shared/form/Select";
import Textarea from "../../components/shared/form/Textarea";
import Button from "../../components/shared/Button";
import {useState} from "react";
import {
    typeOptions,
    issueTypeOptions,
    experienceOptions,
    permissionOptions
} from "../../utils/bounties";
import axios from "axios";
import {useRouter} from "next/router";
import {api} from "../../utils/api";
import {thankYouPath} from "../../utils/routes";
import {BountyResource} from "../../types/supabase";
import {nanoid} from "nanoid";
import ResourceItem from "../../components/bounty/resources/ResourceItem";
import ModalAddResource from "../../components/bounty/resources/ModalAddResource";


type FormValues = {
    title: string;
    description: string;
    acceptance_criteria: string;
    project_type: string;
    issue_type: string;
    requires_work_permission: boolean;
    experience_level: string;
    repository_url: string;
    repository_issue_url?: string;
    tags?: string;
}

export default function Create() {
    const formMethods = useForm<FormValues>();
    const {handleSubmit, setValue} = formMethods;
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const [resources, setResources] = useState<Partial<BountyResource>[]>([]);
    const [addResourceModalOpen, setAddResourceModalOpen] = useState(false);

    const submitBounty = async (formData: FormValues) => {
        const tags = formData.tags?.split(",");
        try {
            setSubmitting(true);
            const {data} = await api.post("bounties", {
                ...formData,
                tags,
                resources: resources.map(resource => ({...resource, id: undefined}))
            });
            formMethods.reset();
            await router.push(thankYouPath);
        } catch (e) {
            let errMessage: string;
            if (axios.isAxiosError(e) && e.response?.status === 422) {
                // @ts-ignore
                errMessage = e.response.data.error;
                // @ts-ignore
                if (e.response.data.details) {
                    // @ts-ignore
                    errMessage += "\n\n" + e.response.data.details.map((detail: any) => detail.message).join(",\n");
                }
            } else {
                errMessage = "Something went wrong. Please try again in a few moments";
            }
            alert(errMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const addResource = ({description, url}: { description: string, url: string }) => {
        setResources([...resources, {description, url, id: nanoid(5)}]);
    };

    const removeResource = (id: string) => {
        setResources(resources.filter(resource => resource.id !== id));
    }

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
                        <h2 className="font-semibold text-xl text-theme-title dark:text-theme-title-dark mb-6">
                            Bounty Details
                        </h2>
                        <FormProvider {...formMethods}>
                            <form onSubmit={handleSubmit(submitBounty)}
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
                                <div>
                                    <Input
                                        label="Price*"
                                        name="value"
                                        placeholder="min 10 USDC"
                                        type="number"
                                        options={{
                                            required: true,
                                            min: 10
                                        }}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Textarea
                                        label="Description*"
                                        name="description"
                                        placeholder=""
                                        options={{required: true}}
                                    />
                                    <span
                                        className="font-medium text-xs text-theme-border dark:text-theme-border-dark mt-1">
                                          Brief description about the content. ~100 characters
                                    </span>
                                </div>
                                <div className="md:col-span-2">
                                    <Textarea
                                        label="Acceptance criteria*"
                                        name="acceptance_criteria"
                                        placeholder=""
                                        options={{required: true}}
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="Repository URL*"
                                        name="repository_url"
                                        placeholder="https://github.com/..."
                                        type="text"
                                        options={{required: true}}
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="Issue URL"
                                        name="repository_issue_url"
                                        placeholder="https://github.com/..."
                                        type="text"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <span
                                        className="block font-semibold text-xs text-primary dark:text-primary-dark uppercase mb-2">
                                        Resources
                                    </span>
                                    <div className="flex items-start gap-6 mb-4 flex-wrap">
                                        {resources.map(resource => (
                                            <ResourceItem key={resource.id} resource={resource}
                                                          onRemove={removeResource}/>
                                        ))}
                                    </div>
                                    <button
                                        className=""
                                        type="button"
                                        onClick={() => setAddResourceModalOpen(true)}
                                    >
                                        + Add Resource
                                    </button>
                                </div>
                                <div>
                                    <Button label={submitting ? "Loading..." : "Submit"}
                                            disabled={submitting}/>
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                </div>
                <ModalAddResource
                    open={addResourceModalOpen}
                    setOpen={setAddResourceModalOpen}
                    onSubmit={addResource}
                />
            </RequiresAuth>
        </Layout>
    );
};