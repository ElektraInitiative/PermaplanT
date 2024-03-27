import { ReactElement } from 'react';
import IconButton from '@/components/Button/IconButton';
import {
  KEYBINDINGS_SCOPE_DRAWING_LAYER,
  createKeyBindingsAccordingToConfig,
} from '@/config/keybindings';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useKeyHandlers } from '@/hooks/useKeyHandlers';
import CloseIcon from '@/svg/icons/close.svg?react';

export function DrawingLayerStatusPanelContent(props: { text: string }): ReactElement {
  const clearStatusPanelContent = useMapStore((state) => state.clearStatusPanelContent);
  const drawingLayerClearSelectedShape = useMapStore(
    (state) => state.drawingLayerClearSelectedShape,
  );

  const exitDrawingMode = () => {
    clearStatusPanelContent();
    drawingLayerClearSelectedShape();
  };

  const keyHandlerActions: Record<string, () => void> = {
    exitDrawingMode: exitDrawingMode,
  };

  useKeyHandlers(
    createKeyBindingsAccordingToConfig(KEYBINDINGS_SCOPE_DRAWING_LAYER, keyHandlerActions),
  );

  return (
    <>
      <div className="flex flex-row items-center justify-center">{props.text}</div>
      <div className="flex items-center justify-center">
        <IconButton
          className="m-2 h-8 w-8 border border-neutral-500 p-1"
          onClick={exitDrawingMode}
          data-tourid="placement_cancel"
        >
          <CloseIcon></CloseIcon>
        </IconButton>
      </div>
    </>
  );
}
