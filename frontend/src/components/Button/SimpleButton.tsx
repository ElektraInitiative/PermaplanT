interface SimpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export default function SimpleButton(props: SimpleButtonProps) {
  const className =
    'inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary-button px-4 py-2.5 text-center text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 border border-primary-button-dark ' +
    ' dark:text-white dark:bg-primary-button-dark border-primary-button-light';
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

