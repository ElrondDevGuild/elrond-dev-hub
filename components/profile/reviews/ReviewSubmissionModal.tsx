import {useForm, FormProvider} from "react-hook-form";
import {useEffect, useState} from "react";
import Popup from "../../shared/Dialog";
import {Bounty, User} from "../../../types/supabase";
import {AiOutlineLoading} from "react-icons/ai";
import Button from "../../shared/Button";
import Textarea from "../../shared/form/Textarea";
import Select from "../../shared/form/Select";
import {IOption} from "../../shared/form/SelectElement";
import ReviewRating from "../../ReviewRating";
import {api, getApiErrorMessage} from "../../../utils/api";

type FormValues = {
    review: string;
    rating: number;
};
export default function ReviewSubmissionModal(
    {
        open = false,
        setOpen,
        bounty,
        applicationId
    }: {
        open: boolean,
        setOpen: (value: boolean) => void,
        bounty: Bounty,
        applicationId: string
    }
) {
    const formMethods = useForm<FormValues>();
    const {handleSubmit, reset} = formMethods;
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (values: FormValues) => {
        try {
            setLoading(true);
            const {data} = await api.post("user/reviews", {
                ...values,
                application_id: applicationId
            });
            setOpen(false);
        } catch (e) {
            alert(getApiErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    const ratingOptions: IOption[] = [
        {
            id: 1,
            name: "1",
            icon: <ReviewRating rating={1}/>
        },
        {
            id: 2,
            name: "2",
            icon: <ReviewRating rating={2}/>
        },
        {
            id: 3,
            name: "3",
            icon: <ReviewRating rating={3}/>
        },
        {
            id: 4,
            name: "4",
            icon: <ReviewRating rating={4}/>
        },
        {
            id: 5,
            name: "5",
            icon: <ReviewRating rating={5}/>
        },
    ];

    useEffect(() => {
        reset({
            review: "",
            rating: 0
        });
    }, [open]);

    return (
        <Popup open={open} setOpen={setOpen} title={`Review for ${bounty.owner.name}`}>
            <FormProvider {...formMethods}>
                <form
                    className="flex flex-col w-full items-start px-4 gap-y-8"
                    onSubmit={handleSubmit(onSubmitHandler)}
                >
                    <p className="text-theme-text dark:text-theme-text-dark">
                        Please leave a review for {bounty.owner.name} regarding the bounty
                        <b>{` "${bounty.title}"`}</b>
                    </p>
                    <div className="w-full">
                        <Textarea
                            label="Review*"
                            name="review"
                            placeholder=""
                            options={{
                                required: true,
                                minLength: {
                                    value: 30,
                                    message: "Minimum 30 characters"
                                }
                        }}
                        />
                    </div>
                    <div className="w-full">
                        <Select
                            label="Rating*"
                            name="rating"
                            selectOptions={ratingOptions}
                            placeholder="Choose rating"
                            options={{
                                required: true,
                        }}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                        {loading ? (
                            <AiOutlineLoading
                                className="animate-spin w-5 h-5 text-theme-text dark:text-theme-text-dark"/>
                        ) : (
                            <>
                                <Button
                                    label="Submit"
                                    type="submit"
                                    extraClasses="w-full sm:w-40 justify-center"
                                />
                                <Button
                                    label="Close"
                                    theme="secondary"
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        setOpen(false)
                                    }}
                                    type="button"
                                    extraClasses="w-full sm:w-40 justify-center"
                                />
                            </>
                        )}
                    </div>
                </form>
            </FormProvider>
        </Popup>);
};