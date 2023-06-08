export type PlantSuggestionListProps = {
  header: string;
  children: React.ReactNode[];
};

export function PlantSuggestionList({ header, children }: PlantSuggestionListProps) {
  return (
    <>
      <h3>{header}</h3>
      <div className="ml-1 border-l border-l-neutral-500 pl-4">{children}</div>
    </>
  );
}
