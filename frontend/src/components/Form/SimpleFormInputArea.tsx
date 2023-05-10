import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface SimpleFormInputAreaProps<T extends FieldValues>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: Path<T>;
  labelText: string;
  register?: UseFormRegister<T>;
}

export default function SimpleFormAreaInput<T extends FieldValues>({
  id,
  labelText = '',
  register,
  ...props
}: SimpleFormInputAreaProps<T>) {
  return (
    <div className="dark:text-white">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {labelText}
        {props.required ? <span className="text-red-800"> *</span> : <></>}
      </label>
      <textarea
        id={id}
        {...props}
        {...register?.(id)}
        className="dark:bg-primary-textfield-dark block w-full rounded-lg border border-neutral-500 bg-neutral-100 p-2.5 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none dark:bg-neutral-100-dark dark:focus:border-primary-300"
      />
    </div>
  );
}
