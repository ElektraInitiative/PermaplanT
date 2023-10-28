import { useDarkModeStore } from '@/features/dark_mode';
import MDEditor from '@uiw/react-md-editor';
import { FieldValues, Path } from 'react-hook-form';

interface MarkdownEditorProps<T extends FieldValues> {
  /** The elements unique id. */
  id: Path<T>;
  /** Text that should be displayed in the accompanying label component. */
  labelText: string;
  /** Additional class names to apply to the input. */
  className?: string;
  /** Callback function that is called when the input value changes. */
  onChange: (value: string | undefined) => void;
  /** The current value of the input. */
  value: string | undefined;
}

export default function MarkdownEditor<T extends FieldValues>({
  id,
  labelText,
  className,
  onChange,
  value,
}: MarkdownEditorProps<T>) {
  const darkMode = useDarkModeStore((state) => state.darkMode);

  return (
    <div className="dark:text-white" data-color-mode={darkMode ? 'dark' : 'light'}>
      {labelText && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          {labelText}
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
