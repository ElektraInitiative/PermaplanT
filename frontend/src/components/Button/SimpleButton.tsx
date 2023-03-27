interface SimpleButtonProps {
  title: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function SimpleButton({ title, onClick }: SimpleButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center justify-between rounded-lg bg-gray-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
      onClick={onClick}
    >
      {title}
    </button>
  );
}

