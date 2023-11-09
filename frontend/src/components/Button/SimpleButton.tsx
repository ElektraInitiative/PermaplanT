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

const variantStyles = {
  [ButtonVariant.primaryBase]:
    'bg-primary-500 dark:bg-primary-300 border-primary-500 hover:bg-primary-600 dark:hover:bg-primary-200 active:bg-primary-700 dark:active:bg-primary-400 text-primary-50 dark:text-primary-700',
  [ButtonVariant.secondaryBase]:
    'bg-secondary-500 dark:bg-secondary-300 border-secondary-500 hover:bg-secondary-600 dark:hover:bg-secondary-200 active:bg-secondary-900 text-secondary-50 dark:text-secondary-700 dark:focus:ring-secondary-100',
  [ButtonVariant.primaryContainer]:
    'bg-primary-200 dark:bg-primary-600 border-primary-500 hover:bg-primary-200 dark:hover:bg-primary-600 active:bg-primary-500 text-primary-900 dark:text-primary-200',
  [ButtonVariant.secondaryContainer]:
    'bg-secondary-200 dark:bg-secondary-600 border-secondary-500 hover:bg-secondary-200 dark:hover:bg-secondary-600 active:bg-secondary-900 text-secondary-900 dark:text-secondary-200',
  [ButtonVariant.dangerBase]:
    'bg-red-500 dark:bg-red-600 border-red-500 dark:border-red-500 active:border-red-900 dark:active:border-red-800 hover:bg-red-600 dark:hover:bg-red-500 active:bg-red-900 dark:active:bg-red-800 text-red-50',
};

/**
 * A styled HTML button.
 * @param props All React props for buttons can be applied.
 */
export default function SimpleButton({
  variant = ButtonVariant.primaryBase,
  ...props
}: SimpleButtonProps) {
  const className =
    'button disabled:bg-neutral-300 disabled:border-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-300-dark dark:disabled:border-neutral-300-dark dark:disabled:text-neutral-500-dark disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-secondary-200 dark:focus:ring-secondary-300 border ' +
    variantStyles[variant];

  return (
    <button
      type="button"
      {...props}
      className={className + (props.className ? ' ' + props.className : '')}
    ></button>
  );
}
