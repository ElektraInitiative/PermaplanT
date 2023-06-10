export type PlantSuggestionListProps = {
  header: string;
  children: React.ReactNode[];
};

export function PlantSuggestionList({ header, children }: PlantSuggestionListProps) {
  return (
    <>
      <h3>{header}</h3>
      <ul className="ml-1 flex flex-col gap-2 border-l border-l-neutral-500 pl-2">{children}</ul>
    </>
  );
}
