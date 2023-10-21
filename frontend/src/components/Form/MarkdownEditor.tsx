import { useDarkModeStore } from '@/features/dark_mode';
import MDEditor from '@uiw/react-md-editor';
import { FieldValues, Path } from 'react-hook-form';

interface MarkdownEditorProps<T extends FieldValues> {
  id: Path<T>;
  labelText: string;
  errorTitle?: string;
  className?: string;
  required?: boolean;
  onChange: (value: string | undefined) => void;
  value: string | undefined;
}

export default function MarkdownEditor<T extends FieldValues>({
  id,
  labelText,
  className,
  onChange,
  value,
  ...props
}: MarkdownEditorProps<T>) {
  const darkMode = useDarkModeStore((state) => state.darkMode);

  return (
    <div className="dark:text-white" data-color-mode={darkMode ? 'dark' : 'light'}>
      {labelText && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          {labelText}
          {props.required ? <span className="text-red-800"> *</span> : <></>}
        </label>
      )}
      <MDEditor
        id={id}
        value={value}
        onChange={onChange}
        draggable={false}
        className={`input border border-neutral-500 bg-neutral-100 placeholder-neutral-500 focus:border-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:border-neutral-400 disabled:text-neutral-400 aria-[invalid=true]:border-red-400 dark:border-neutral-400-dark dark:bg-neutral-50-dark dark:focus:border-primary-300 dark:disabled:border-neutral-400-dark dark:disabled:text-neutral-400-dark dark:aria-[invalid=true]:border-red-400 ${
          className ?? ''
        }`}
      />
    </div>
  );
}
