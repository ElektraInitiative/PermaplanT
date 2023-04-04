interface SimpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export enum ButtonVariant {
  primary,
  secondary,
}

/**
 * A styled HTML button.
 * @param props.variant The variant specifies the look of the button.
 * @param props All React props for buttons can be applied.
 */
export default function SimpleButton({
  variant = ButtonVariant.primary,
  ...props
}: SimpleButtonProps) {
  const colors = [
    'bg-primary-600 dark:bg-primary-800 border-primary-500 hover:bg-primary-700 dark:hover:bg-primary-700 active:bg-primary-900 ',
    'bg-secondary-600 dark:bg-secondary-800 border-secondary-500 hover:bg-secondary-700 dark:hover:bg-secondary-700 active:bg-secondary-900 ',
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

