import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { MapCollaboratorDto, UserDto } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import SearchInput from '@/components/Form/SearchInput';
import { useOutsideClickAlerter as useOnOutsideClick } from '@/hooks/useOutsideClickAlerter';
import CloseIcon from '@/svg/icons/close.svg?react';
import { cn } from '@/utils/cn';

export interface CollaboratorPanelProps {
  handleSearch: (search: string) => void;
  onResultClick: (result: UserDto) => void;
  onRemoveCollaborator: (userId: string) => void;
  collaborators: MapCollaboratorDto[];
  userSearchResults?: UserDto[] | undefined;
}

export function CollaboratorPanel({
  handleSearch,
  onResultClick,
  onRemoveCollaborator,
  collaborators,
  userSearchResults,
}: CollaboratorPanelProps) {
  const [searchResultsVisible, setSearchResultsVisible] = useState(false);
  const panelRef = useRef(null);
  const searchInputRef = useRef(null);
  useOnOutsideClick([panelRef, searchInputRef], () => setSearchResultsVisible(false));

  return (
    <div className="w-full">
      <h2>Collaborators</h2>
      <p className="mb-4 text-neutral-400">Invite others to collaborate on this map</p>

      <SearchInput
        ref={searchInputRef}
        onFocus={() => setSearchResultsVisible(true)}
        handleSearch={handleSearch}
        placeholder="Search for a user"
      />
      <div className="absolute w-80 px-4 pt-2">
        <AnimatePresence>
          {userSearchResults && searchResultsVisible && (
            <motion.div
              ref={panelRef}
              initial={{ opacity: 1 }}
              animate={{
                transition: { delay: 0, duration: 0.1 },
              }}
              exit={{
                opacity: 0,
              }}
            >
              <SearchResultsPanel {...{ userSearchResults, onResultClick }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section className="mt-4 h-72 overflow-hidden rounded-lg border border-neutral-600 bg-neutral-800 p-2">
        {collaborators.length === 0 && <p className=" text-neutral-400">No collaborators yet</p>}

        <div className="my-2 h-full space-y-2 overflow-auto pr-4">
          {collaborators.map((collaborator) => (
            <CollaboratorListItem key={collaborator.userId} name={collaborator.username}>
              <IconButton
                className="h-4 w-4 text-neutral-400"
                onClick={() => onRemoveCollaborator(collaborator.userId)}
              >
                <CloseIcon />
              </IconButton>
            </CollaboratorListItem>
          ))}
        </div>
      </section>
    </div>
  );
}

type CollaboratorListItemProps = React.PropsWithChildren<{
  name: string;
  className?: string;
  onClick?: () => void;
}>;

function CollaboratorListItem({ name, children, className, onClick }: CollaboratorListItemProps) {
  const baseStyles = 'flex items-center justify-between rounded-md bg-neutral-900 px-2 py-1';

  return (
    <div className={cn(baseStyles, className)} onClick={onClick}>
      <p className="align-middle text-neutral-400">{name}</p>
      {children}
    </div>
  );
}

type SearchResultsPanelProps = Required<
  Pick<CollaboratorPanelProps, 'onResultClick' | 'userSearchResults'>
>;

function SearchResultsPanel({ userSearchResults, onResultClick }: SearchResultsPanelProps) {
  return (
    <div className="relative z-10 w-full rounded-lg border border-primary-300 bg-neutral-900 p-4">
      <div className="space-y-2">
        {userSearchResults.length === 0 && <p className="text-neutral-400">No results</p>}
        {userSearchResults.map((result) => (
          <CollaboratorListItem
            className="bg-neutral-950 hover:bg-primary-200 hover:bg-opacity-20"
            onClick={() => onResultClick(result)}
            key={result.id}
            name={result.username}
          />
        ))}
      </div>
    </div>
  );
}
