import { useFormContext } from "react-hook-form";
import { AiFillExclamationCircle } from "react-icons/ai";

import { classNames } from "../../../utils/presentation";
import SelectElement, { IOption } from "./SelectElement";

/**
 * This component is using useFormContext hook from "react-hook-form" to get the form context
 * https://react-hook-form.com/api/useformcontext
 */

interface ISelect {
  label: string;
  name: string;
  selectOptions: IOption[];
  options?: any;
}

export default function Select({
  name,
  options = {},
  label,
  selectOptions,
}: ISelect) {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const id = `${name}-id`;

  if ("required" in options) {
    options["required"] = "This field is required!";
  }

  const onSelectChange = (newValue: IOption) => {
    setValue(name, newValue.id);
  };

  return (
    <div className="">
      <label
        htmlFor={id}
        className="block font-medium text-sm text-theme-text dark:text-theme-text-dark mb-1"
      >
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
        <SelectElement options={selectOptions} onChange={onSelectChange} />
        {!!errors[name] && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AiFillExclamationCircle
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {!!errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
      )}
    </div>
  );
}
