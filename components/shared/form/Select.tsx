import {useFormContext} from 'react-hook-form';
import {AiFillExclamationCircle} from 'react-icons/ai';

import SelectElement, {IOption} from './SelectElement';
import {useMemo} from "react";

/**
 * This component is using useFormContext hook from "react-hook-form" to get the form context
 * https://react-hook-form.com/api/useformcontext
 */


interface IInput {
  label: string;
  name: string;
  selectOptions: IOption[];
  options?: any;
  placeholder?: string;
}

export default function Select({name, options = {}, label, selectOptions, placeholder}: IInput) {
  const {
    setValue,
    formState: {errors},
    register
  } = useFormContext();

  const id = `${name}-id`;
  if ("required" in options) {
    options["required"] = "This field is required!";
  }

  const validateRequired = (value: any) => {
    return ("required" in options) ? value !== "" : true;
  };

  register(name, {
    ...options,
    validate: validateRequired
  });


  const onSelectChange = (newValue: IOption) => {
    setValue(name, newValue.id);
  };

  const _selectOptions = useMemo(() => {
    if (!placeholder) {
      return selectOptions;
    }

    return [{id: "", name: placeholder, unavailable: true}, ...selectOptions];
  }, [selectOptions, placeholder]);


  return (
      <div className="relative">
        <label htmlFor={id}
               className="block font-semibold text-xs text-primary dark:text-primary-dark uppercase mb-2">
          {label}
        </label>

        <SelectElement options={_selectOptions} onChange={onSelectChange}/>
        {!!errors[name] && (
            <div className="absolute inset-y-0 right-0 pr-8 flex items-center pointer-events-none">
              <AiFillExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true"/>
            </div>
        )}

        {!!errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>}
      </div>
  );
}
