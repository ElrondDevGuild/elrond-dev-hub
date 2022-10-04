import Popup from "../../shared/Dialog";
import Input from "../../shared/form/Input";
import {useForm, FormProvider} from "react-hook-form";
import Button from "../../shared/Button";
import {Dialog} from '@headlessui/react';

type FormValues = {
    description: string;
    url: string;
};

export default function ModalAddResource(
    {
        open = false,
        setOpen,
        onSubmit
    }: { open: boolean, setOpen: (value: boolean) => void, onSubmit: (values: FormValues) => void }
) {
    const formMethods = useForm<FormValues>();
    const {handleSubmit, reset} = formMethods;
    const setOpenState = (value: boolean) => {
        reset({description: '', url: ''});
        setOpen(value);
    }
    const onSubmitHandler = (values: FormValues) => {
        onSubmit(values);
        setOpenState(false);
    }
    return <Popup open={open} setOpen={setOpenState} title="Add a resource">
        <FormProvider {...formMethods}>
            <form
                className="flex flex-col w-full items-start px-4 gap-y-8"
                onSubmit={handleSubmit(onSubmitHandler)}
            >
                <div className="w-full">
                    <Input
                        label="Name*"
                        name="description"
                        placeholder="Name of the resource"
                        type="text"
                        options={{required: true}}
                    />
                </div>
                <div className="w-full">
                    <Input
                        label="URL*"
                        name="url"
                        placeholder="https://example.com"
                        type="url"
                        options={{
                            required: true,
                            pattern:"https://.*"
                    }}
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Button label="Add resource"/>
                    <Button label="Close" theme="secondary" onClick={() => setOpenState(false)}/>
                </div>
            </form>
        </FormProvider>
    </Popup>
};