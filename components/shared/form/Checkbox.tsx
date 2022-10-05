import {useFormContext} from "react-hook-form";
import {nanoid} from "nanoid";
import {classNames} from "../../../utils/presentation";
import {AiFillExclamationCircle} from "react-icons/ai";
import React, {PropsWithChildren} from "react";

type CheckboxProps = {
    label?: string;
    name: string;
    options: any;
}

export default function Checkbox({name, label, options, children }: PropsWithChildren<CheckboxProps>) {
    const {
        register,
        formState: {errors},
    } = useFormContext();

    const id = `${name}-${nanoid(5)}-id`;
    if ("required" in options) {
        options["required"] = "This field is required!";
    }

    return (
        <div className="">
            {label && <label htmlFor={id}
                             className="block font-semibold text-xs text-primary dark:text-primary-dark uppercase mb-2">
                {label}
            </label>
            }

                <div className="w-full flex items-start space-x-4">
                    <div className="flex h-5 items-center mt-0.5">
                        <input
                            id={id}
                            type="checkbox"
                            className={classNames(
                                !!errors[name] ? "text-red-900 border-red-300 focus-within:ring-red-500" : "border-theme-border dark:border-theme-border-dark focus-within:ring-indigo-500",
                                "h-4 w-4 rounded bg-white dark:bg-secondary-dark-lighter border focus:outline-none text-theme-text dark:text-theme-text-dark  focus-within:ring-0 autofill:bg-transparent font-medium text-sm"
                            )}
                            {...register(name, options)}
                        />
                        {!!errors[name] && (
                            <AiFillExclamationCircle className="h-5 w-5 text-red-500 ml-2"
                                                     aria-hidden="true"/>
                        )}
                    </div>
                    <div className="flex flex-col w-full space-y-1 items-start">
                    <p className="text-theme-text dark:text-secondary-dark">{children}</p>
                        {!!errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>}
                    </div>
                </div>
        </div>
    );
};