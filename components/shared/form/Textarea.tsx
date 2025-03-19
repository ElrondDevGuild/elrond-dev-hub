import { useFormContext } from 'react-hook-form';
import { AiFillExclamationCircle } from 'react-icons/ai';

import { classNames } from '../../../utils/presentation';

/**
 * This component is using useFormContext hook from "react-hook-form" to get the form context
 * https://react-hook-form.com/api/useformcontext
 */

interface ITextarea {
  label: string;
  name: string;
  options?: any;
  placeholder: string;
}

export default function Textarea({ name, options = {}, label, placeholder }: ITextarea) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const id = `${name}-id`;

  if ("required" in options) {
    options["required"] = "This field is required!";
  }

  return (
    <div className="">
      <label htmlFor={id} className="block font-medium text-sm text-theme-text dark:text-theme-text-dark mb-1">
        {label} {options.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={classNames(
          "flex relative rounded-md focus-within:ring-1",
          !!errors[name]
            ? "border border-red-300 focus-within:ring-red-500 focus-within:border-red-500"
            : "border border-theme-border dark:border-theme-border-dark focus-within:ring-primary focus-within:border-primary dark:focus-within:ring-primary-dark dark:focus-within:border-primary-dark"
        )}
      >
        <textarea
          id={id}
          rows={3}
          className={classNames(
            !!errors[name] ? "text-red-900" : "",
            "bg-white dark:bg-gray-800 flex-1 block w-full focus:outline-none text-theme-text dark:text-theme-text-dark border-0 focus-within:ring-0 autofill:bg-transparent font-medium text-sm rounded-md px-3 py-2"
          )}
          placeholder={placeholder}
          {...register(name, options)}
        />
        {!!errors[name] && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AiFillExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {!!errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>}
    </div>
  );
}
