export type PlantSuggestionListProps = {
  header: string;
  children: React.ReactNode[];
  hasContent: boolean;
  noContentElement: React.ReactNode;
};

export function PlantSuggestionList({
  header,
  hasContent,
  noContentElement,
  children,
}: PlantSuggestionListProps) {
  return (
    <>
      <h3>{header}</h3>
      {hasContent ? (
        <>
          <hr />
          <ul className="ml-1 flex flex-col gap-2 border-l border-l-neutral-500 pl-2">
            {children}
          </ul>
        </>
      ) : (
        <div className="">{noContentElement}</div>
      )}
    </>
  );
}
