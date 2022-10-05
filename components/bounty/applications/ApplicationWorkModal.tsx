import Popup from "../../shared/Dialog";
import {useForm, FormProvider} from "react-hook-form";
import Textarea from "../../shared/form/Textarea";
import Button from "../../shared/Button";
import Checkbox from "../../shared/form/Checkbox";
import {useEffect, useState} from "react";
import {api, getApiErrorMessage} from "../../../utils/api";
import {AiOutlineLoading} from "react-icons/ai";

type FormValues = {
    message: string;
    terms: boolean | null;
};

export default function ApplicationWorkModal(
    {
        open = false,
        setOpen,
        bountyId,
        onSuccess
    }: { open: boolean, setOpen: (value: boolean) => void, bountyId: string, onSuccess: () => void }
) {
    const formMethods = useForm<FormValues>();
    const {handleSubmit, reset} = formMethods;
    const [loading, setLoading] = useState(false);

    const setOpenState = (value: boolean) => {
        setOpen(value);
    };
    const onSubmitHandler = async (values: FormValues) => {
        try {
            setLoading(true);
            const {data} = await api.post(`/bounties/${bountyId}/applications`, values);
            onSuccess();
        } catch (e) {
            alert(getApiErrorMessage(e));
        } finally {
            setOpenState(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        reset({
            message: "",
            terms: null,
        });
    }, [open]);

    return (
        <Popup open={open} setOpen={setOpenState} title="Apply to work">
            <FormProvider {...formMethods}>
                <form
                    className="flex flex-col w-full items-start px-4 gap-y-8"
                    onSubmit={handleSubmit(onSubmitHandler)}
                >
                    <p className="text-theme-text dark:text-theme-text-dark">
                        Please write a description of
                        your plan to complete this bounty and why you are a good fit for this
                        bounty.
                    </p>
                    <div className="w-full">
                        <Textarea
                            label="Application*"
                            name="message"
                            placeholder=""
                            options={{required: true}}
                        />
                    </div>
                    <div className="w-full flex items-start space-x-4">
                        <Checkbox
                            name="terms"
                            options={{required: true}}
                        >
                            I agree to the <a href="/terms"
                                              className="font-semibold underline">Terms
                            of Service</a> and <a href="/privacy"
                                                  className="font-semibold underline">Privacy
                            Policy</a>.
                        </Checkbox>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                        {loading ? (
                            <AiOutlineLoading
                                className="animate-spin w-5 h-5 text-theme-text dark:text-theme-text-dark"/>
                        ) : (
                            <>
                                <Button
                                    label="Apply"
                                    type="submit"
                                    extraClasses="w-full sm:w-40 justify-center"
                                />
                                <Button
                                    label="Close"
                                    theme="secondary"
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        setOpenState(false)
                                    }}
                                    type="button"
                                    extraClasses="w-full sm:w-40 justify-center"
                                />
                            </>
                        )}
                    </div>
                </form>
            </FormProvider>
        </Popup>
    );

};