import IconButton from '@/components/Button/IconButton';
import SearchInput from '@/components/Form/SearchInput';
import CloseIcon from '@/svg/icons/close.svg?react';
import { cn } from '@/utils/cn';

export interface CollaboratorPanelProps {
  handleSearch: (search: string) => void;
  collaborators: string[];
  userSearchResults?: string[];
}

export function CollaboratorPanel({
  handleSearch,
  collaborators,
  userSearchResults,
}: CollaboratorPanelProps) {
  return (
    <div className="w-full">
      <h2>Collaborators</h2>
      <p className="mb-4 text-neutral-400">Invite others to collaborate on this map</p>

      <SearchInput handleSearch={handleSearch} placeholder="Search for a user" />
      <div className="absolute w-80 px-4 pt-2">
        {userSearchResults ? <SearchResultsPanel results={userSearchResults} /> : null}
      </div>

      <section className="mt-4 h-72 rounded-lg border border-neutral-600 bg-neutral-800 p-4">
        {collaborators.length === 0 && <p className=" text-neutral-400">No collaborators yet</p>}

        <div className="space-y-2">
          {collaborators.map((collaborator, index) => (
            <CollaboratorListItem key={index} collaborator={collaborator}>
              <IconButton className="h-4 w-4 text-neutral-400">
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
  collaborator: string;
  className?: string;
}>;

function CollaboratorListItem({ collaborator, children, className }: CollaboratorListItemProps) {
  const baseStyles = 'flex items-center justify-between rounded-md bg-neutral-900 px-2 py-1';

  return (
    <div className={cn(baseStyles, className)}>
      <p className="align-middle text-neutral-400">{collaborator}</p>
      {children}
    </div>
  );
}

function SearchResultsPanel({ results }: { results: string[] }) {
  return (
    <div className="relative z-10 w-full rounded-lg border border-primary-300 bg-neutral-900 p-4">
      <div className="space-y-2">
        {results.length === 0 && <p className="text-neutral-400">No results</p>}
        {results.map((result, index) => (
          <CollaboratorListItem
            className="bg-neutral-950 hover:bg-primary-200 hover:bg-opacity-20"
            key={index}
            collaborator={result}
          />
        ))}
      </div>
    </div>
  );
}
