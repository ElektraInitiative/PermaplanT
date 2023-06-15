import ButtonLink from '@/components/Button/ButtonLink';

export function EmptyAvailablePlants() {
  return (
    <div className="flex flex-1 flex-col items-center p-4 pt-0">
      <span className="text-md mb-4 text-center font-medium">Start by adding some seeds</span>
      <p className="mb-4 max-w-xs text-center text-sm text-neutral-500">
        We could not find plants that are seasonal for which you have seeds for.
      </p>
      <ButtonLink to="/seeds" title="View your seeds" />
    </div>
  );
}
