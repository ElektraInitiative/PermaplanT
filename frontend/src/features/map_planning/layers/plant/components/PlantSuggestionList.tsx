import IconButton from '@/components/Button/IconButton';
import CaretDown from '@/svg/icons/caret-down.svg?react';
import { motion } from 'framer-motion';
import React from 'react';

export type PlantSuggestionListProps = {
  /** A title to display above the list */
  header: string;
  /** The elements to display */
  children: React.ReactNode[];
  /** Whether the list is loading */
  isLoading: boolean;
  /** Whether the list has content */
  hasContent: boolean;
  /** The element to display when there is no content */
  noContentElement: React.ReactNode;
};

/**
 * A list of plant suggestions
 */
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
          <motion.div
            animate={{
              rotate: isExpanded ? 0 : 180,
            }}
          >
            <CaretDown className="h-6 w-6" />
          </motion.div>
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
