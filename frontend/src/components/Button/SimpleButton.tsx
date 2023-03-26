interface SimpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: React.ReactNode;
}

export enum ButtonVariant {
  primary,
  secondary,
  neutral,
}

export default function SimpleButton(props: SimpleButtonProps) {
  const colors = [
    'bg-primary-800 border-primary-500 hover:bg-primary-600 active:bg-primary-900 ',
    'bg-secondary-800 border-secondary-500 hover:bg-secondary-600 active:bg-secondary-900 ',
    'bg-neutral-800 border-neutral-500 hover:bg-neutral-600 active:bg-neutral-900 ',
  ];
  const variant = props.variant ? props.variant : ButtonVariant.primary;
  const className =
    'inline-flex h-10 w-full items-center justify-center rounded-lg text-white px-4 py-2.5 text-center text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 border ' +
    colors[variant];
  return (
    <button
      type="button"
      {...props}
      className={className + (props.className ? ' ' + props.className : '')}
    >
      {props.children}
    </button>
  );
}

