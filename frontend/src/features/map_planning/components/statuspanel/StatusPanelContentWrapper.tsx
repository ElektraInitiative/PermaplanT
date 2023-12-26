import IconButton from '@/components/Button/IconButton';
import CloseIcon from '@/svg/icons/close.svg?react';

export interface StatusPanelContentWrapperProps {
  content: string;
  onClose?: () => void;
}

/**
 * This component provides a close button and consistent margins for status panel messages
 * (See src/features/map_planning/store/MapStoreTypes.tsx for more details).
 *
 * @param content Text message displayed in the status panel.
 * @param onClose Callback for the contained close button.
 * @constructor
 */
export function StatusPanelContentWrapper({ content, onClose }: StatusPanelContentWrapperProps) {
  return (
    <>
      <div className="flex flex-row items-center justify-center">{content}</div>
      <div className="flex items-center justify-center">
        <IconButton
          className="m-2 h-8 w-8 border border-neutral-500 p-1"
          onClick={onClose}
          data-tourid="placement_cancel"
        >
          <CloseIcon></CloseIcon>
        </IconButton>
      </div>
    </>
  );
}
