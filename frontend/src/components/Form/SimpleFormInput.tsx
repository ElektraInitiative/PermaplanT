import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface SimpleFormInputProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The elements unique id. */
  id: Path<T>;
  /** Text that should be displayed in the accompanying label component. */
  labelText: string;
  /** UseFormRegister hook of the surrounding form. */
  register?: UseFormRegister<T>;
  /** Will return the input value as a number if this param is set to true. */
  valueAsNumber?: boolean;
  /** Text that will be displayed if an error is encountered. */
  errorTitle?: string;
}

/**
 * Wrapper around the default input component with a label and custom styling.
 *
 * @param id The elements unique id.
 * @param labelText Text that should be displayed in the accompanying label component.
 * @param register UseFormRegister hook of the surrounding form.
 * @param valueAsNumber Will return the input value as a number if this param is set to true.
 * @param errorTitle Text that will be displayed if an error is encountered.
 * @param props Any prop that is available for the default input element, is also accepted.
 * @constructor
 */
export default function SimpleFormInput<T extends FieldValues>({
  id,
  labelText = '',
  register,
  valueAsNumber = false,
  errorTitle,
  ...props
}: SimpleFormInputProps<T>) {
  return (
    <div className="dark:text-white">
      {labelText && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          {labelText}
          {props.required ? <span className="text-red-800"> *</span> : <></>}
        </label>
      )}
      <input
        id={id}
        title={errorTitle}
        {...props}
        {...register?.(id, {
          valueAsNumber: props.type === 'number' || valueAsNumber,
        })}
        className="block h-11 w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none aria-[invalid=true]:border-red-400 dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300 aria-[invalid=true]:dark:border-red-400"
      />
    </div>
  );
}
