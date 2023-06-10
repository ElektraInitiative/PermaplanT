interface SimpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The variant specifies the look of the button. */
  variant?: ButtonVariant;
}

export enum ButtonVariant {
  primaryBase,
  secondaryBase,
  primaryContainer,
  secondaryContainer,
  dangerBase,
}

/**
 * A styled HTML button.
 * @param props All React props for buttons can be applied.
 */
export default function SimpleButton({
  variant = ButtonVariant.primaryBase,
  ...props
}: SimpleButtonProps) {
  const colors = [
    'bg-primary-500 dark:bg-primary-300 border-primary-500 hover:bg-primary-600 dark:hover:bg-primary-200 active:bg-primary-900 text-primary-50 dark:text-primary-700',
    'bg-secondary-500 dark:bg-secondary-300 border-secondary-500 hover:bg-secondary-600 dark:hover:bg-secondary-200 active:bg-secondary-900 text-secondary-50 dark:text-secondary-700',
    'bg-primary-200 dark:bg-primary-600 border-primary-500 hover:bg-primary-200 dark:hover:bg-primary-600 active:bg-primary-900 text-primary-900 dark:text-primary-200',
    'bg-secondary-200 dark:bg-secondary-600 border-secondary-500 hover:bg-secondary-200 dark:hover:bg-secondary-600 active:bg-secondary-900 text-secondary-900 dark:text-secondary-200',
    'bg-red-500 dark:bg-red-300 border-red-500 hover:bg-red-600 dark:hover:bg-red-200 active:bg-red-900 text-red-50 dark:text-red-700',
  ];
  const className =
    'inline-flex h-10 w-full items-center justify-center rounded-lg text-white px-4 py-2.5 text-center text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 border ' +
    colors[variant];
  return (
    <button
      type="button"
      {...props}
      className={className + (props.className ? ' ' + props.className : '')}
    ></button>
  );
}
