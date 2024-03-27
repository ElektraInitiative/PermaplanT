import { ReactElement } from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { cn } from '@/utils/cn';

interface SimpleFormInputProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The elements unique id. */
  id: Path<T>;
  /** Content of the accompanying label component. */
  labelContent: ReactElement | string;
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
  labelContent = '',
  register,
  valueAsNumber = false,
  errorTitle,
  className,
  ...props
}: SimpleFormInputProps<T>) {
  const defaultStyles =
    'input border border-neutral-500 bg-neutral-100 placeholder-neutral-500 focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:border-neutral-400 disabled:text-neutral-400 aria-[invalid=true]:border-red-400 dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300 dark:disabled:border-neutral-400-dark dark:disabled:text-neutral-400-dark dark:aria-[invalid=true]:border-red-400';

  return (
    <div className="dark:text-white">
      {labelContent && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          {labelContent}
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
        className={cn(defaultStyles, className)}
      />
    </div>
  );
}
