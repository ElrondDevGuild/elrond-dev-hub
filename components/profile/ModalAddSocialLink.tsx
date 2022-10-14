import {useForm, FormProvider} from "react-hook-form";
import Popup from "../shared/Dialog";
import Input from "../shared/form/Input";
import Select from "../shared/form/Select";
import {SocialPlatform} from "../../types/supabase";
import Button from "../shared/Button";
import {FaTwitter, FaLinkedin, FaDiscord, FaTelegram, FaGithub} from "react-icons/fa"

type FormValues = {
    platform: string;
    username: string;
};

export default function ModalAddSocialLink(
    {
        open = false,
        setOpen,
        onSubmit,
        platforms
    }: {
        open: boolean,
        setOpen: (value: boolean) => void,
        onSubmit: (values: { platform: SocialPlatform, username: string }) => void,
        platforms: { name: string, id: string, icon: JSX.Element }[]
    }
) {
    const formMethods = useForm<FormValues>();
    const {handleSubmit, reset} = formMethods;
    const setOpenState = (value: boolean) => {
        reset({platform: '', username: ''});
        setOpen(value);
    };
    const onSubmitHandler = (values: FormValues) => {
        onSubmit({platform: values.platform as SocialPlatform, username: values.username});
        setOpenState(false);
    }

    return <Popup open={open} setOpen={setOpenState} title="Add a social link">
        <FormProvider {...formMethods}>
            <form
                className="flex flex-col w-full items-start px-4 gap-y-8"
                onSubmit={handleSubmit(onSubmitHandler)}
            >
                <div className="w-full">
                    <Select
                        name="platform"
                        options={{required: true}}
                        label="Platform*"
                        selectOptions={platforms}
                    />
                </div>
                <div className="w-full">
                    <Input
                        label="Handle*"
                        name="username"
                        placeholder=""
                        type="text"
                        options={{required: true}}
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    <Button label="Add link" extraClasses="w-full sm:w-40 justify-center"/>
                    <Button
                        label="Close"
                        theme="secondary"
                        onClick={() => setOpenState(false)}
                        extraClasses="w-full sm:w-40 justify-center"
                    />
                </div>
            </form>
        </FormProvider>
    </Popup>;

};