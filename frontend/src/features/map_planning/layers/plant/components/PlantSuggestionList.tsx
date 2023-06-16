import IconButton from '@/components/Button/IconButton';
import { ReactComponent as CaretDown } from '@/icons/caret-down.svg';
import React from 'react';

export type PlantSuggestionListProps = {
  header: string;
  children: React.ReactNode[];
  isLoading: boolean;
  hasContent: boolean;
  noContentElement: React.ReactNode;
};

export function PlantSuggestionList({
  header,
  hasContent,
  isLoading,
  noContentElement,
  children,
}: PlantSuggestionListProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const toggleExpand = () => {
    setIsExpanded((e) => !e);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h3>{header}</h3>
        <IconButton onClick={toggleExpand}>
          {isExpanded ? <CaretDown /> : <CaretDown rotate={180} />}
        </IconButton>
      </div>
      {isExpanded &&
        !isLoading &&
        (hasContent ? (
          <ul className="ml-1 flex flex-col gap-2 border-l border-l-neutral-500 pl-2">
            {children}
          </ul>
        ) : (
          <>{noContentElement}</>
        ))}
    </>
  );
}
