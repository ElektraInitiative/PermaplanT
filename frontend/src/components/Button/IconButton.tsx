interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The variant specifies the look of the button. */
  variant?: ButtonVariant;
  /** Active icons (e.g. Grid shown) are rendered in highlighted fashion. */
  renderAsActive?: boolean;
  /** Toolbox icons receive additional styling. */
  isToolboxIcon?: boolean;
}

export enum ButtonVariant {
  primary,
  secondary,
}

const variantStyles = {
  [ButtonVariant.primary]:
    'hover:text-primary-500 dark:hover:text-primary-500 hover:stroke-primary-500 dark:hover:stroke-primary-500 active:stroke-primary-200 dark:active:stroke-primary-200 hover:fill-primary-500 dark:hover:fill-primary-500 active:fill-primary-200 dark:active:fill-primary-200 focus:ring-primary-300 ',
  [ButtonVariant.secondary]:
    'hover:text-secondary-500 dark:hover:text-secondary-500 hover:stroke-secondary-500 dark:hover:stroke-secondary-500 active:stroke-secondary-200 dark:active:stroke-secondary-200 hover:fill-secondary-500 dark:hover:fill-secondary-500 active:fill-secondary-200 dark:active:fill-secondary-200 focus:ring-secondary-300 ',
};

/**
 * A clickable icon.
 * @param props.variant The variant specifies the look of the button.
 * @param props All React props for buttons can be applied.
 */
export default function IconButton({
  variant = ButtonVariant.primary,
  renderAsActive = false,
  isToolboxIcon = false,
  ...props
}: IconButtonProps) {
  const defaultIconStyles =
    'inline-flex h-6 w-6 justify-center rounded-lg items-center text-sm font-medium focus:outline-none focus:ring-1 focus:ring-secondary-100 dark:focus:ring-secondary-500 focus:border-0 dark:focus:border-0 stroke-neutral-800 dark:stroke-neutral-800-dark fill-neutral-800 dark:fill-neutral-800-dark' +
    ' disabled:stroke-neutral-500 dark:disabled:stroke-neutral-500-dark disabled:fill-neutral-500 dark:disabled:fill-neutral-500-dark disabled:cursor-not-allowed' +
    ' ' +
    variantStyles[variant];

  const activeIcon = renderAsActive
    ? 'fill-primary-500 dark:fill-primary-400 stroke-primary-500 dark:stroke-primary-400 border-primary-500 '
    : '';
  const toolboxIcon = isToolboxIcon
    ? 'mx-1 my-2 first-of-type:ml-2 last-of-type:mr-2 h-8 w-8 p-1 border border-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:hover:stroke-primary-400 active:stroke-primary-400 active:fill-primary-400'
    : '';
  const additionalClasses = props.className ? props.className : '';

  return (
    <button
      type="button"
      {...props}
      className={activeIcon + ' ' + toolboxIcon + ' ' + defaultIconStyles + ' ' + additionalClasses}
    ></button>
  );
}
