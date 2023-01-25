interface SimpleButtonProps {
  title: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function SimpleButton({ title, onClick, children = <></> }: SimpleButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex h-11 w-full items-center justify-between rounded-lg bg-primary-button px-4 py-2.5 text-center text-sm font-medium text-white"
      onClick={onClick}
    >
      {title}
      {children}
    </button>
  );
}
