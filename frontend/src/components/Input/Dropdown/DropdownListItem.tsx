interface DropdownListItemProps {
  text: string;
  onClick?: () => void;
  selected?: boolean;
}

export default function DropdownListItem({
  text,
  onClick,
  selected = false,
}: DropdownListItemProps) {
  return (
    <li
      onClick={onClick}
      className="flex items-center justify-between px-4 py-2 text-white hover:bg-zinc-700"
    >
      {text}
      {selected && (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" width="24">
          <path d="m9.55 18-5.7-5.7 1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4Z" />
        </svg>
      )}
    </li>
  );
}
