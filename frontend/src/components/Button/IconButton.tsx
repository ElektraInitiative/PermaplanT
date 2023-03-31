interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export enum ButtonVariant {
  primary,
  secondary,
}

/**
 * A clickable icon.
 * @param props.variant The variant specifies the look of the button.
 * @param props All React props for buttons can be applied.
 */
export default function IconButton({ variant = ButtonVariant.primary, ...props }: IconButtonProps) {
  const colors = [
    'hover:text-primary-500 dark:hover:text-primary-500 hover:stroke-primary-500 dark:hover:stroke-primary-500 active:stroke-primary-200 dark:active:stroke-primary-200',
    'hover:text-secondary-500 dark:hover:text-secondary-500 active:stroke-secondary-900 dark:active:stroke-secondary-900',
  ];
  const className =
    'inline-flex h-6 w-full items-center justify-center rounded-lg items-center text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 stroke-neutral-800 dark:stroke-neutral-800-dark' +
    ' ' +
    colors[variant];
  return (
    <button
      type="button"
      {...props}
      className={className + ' ' + (props.className ? props.className : '')}
    ></button>
  );
}
