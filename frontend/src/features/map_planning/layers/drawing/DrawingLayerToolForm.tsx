import IconButton from '@/components/Button/IconButton';
import {
  KEYBINDINGS_SCOPE_DRAWING_LAYER,
  createKeyBindingsAccordingToConfig,
} from '@/config/keybindings';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useKeyHandlers } from '@/hooks/useKeyHandlers';
import { ReactComponent as CircleIcon } from '@/svg/icons/circle.svg';
import { ReactComponent as CloseIcon } from '@/svg/icons/close.svg';
import { ReactComponent as RectangleIcon } from '@/svg/icons/rectangle.svg';
import { ReactComponent as LineIcon } from '@/svg/icons/wavy-line.svg';
import { useTranslation } from 'react-i18next';

export function DrawingLayerToolForm() {
  const { t } = useTranslation(['common', 'drawingLayerForm']);

  const drawingLayerActivateFreeDrawing = useMapStore(
    (state) => state.drawingLayerActivateFreeDrawing,
  );
  const drawingLayerActivateRectangleDrawing = useMapStore(
    (state) => state.drawingLayerActivateDrawRectangle,
  );
  const drawingLayerActivateDrawEllipse = useMapStore(
    (state) => state.drawingLayerActivateDrawEllipse,
  );

  const setSelectedColor = useMapStore((state) => state.drawingLayerSetSelectedColor);
  const setSelectedStrokeWidth = useMapStore((state) => state.drawingLayerSetSelectedStrokeWidth);
  const selectedColor = useMapStore((state) => state.untrackedState.layers.drawing.selectedColor);
  const selectedStrokeWidth = useMapStore(
    (state) => state.untrackedState.layers.drawing.selectedStrokeWidth,
  );

  const setStatusPanelContent = useMapStore((state) => state.setStatusPanelContent);

  return (
    <>
      <div>
        <h2>Settings</h2>
        <div>
          <div>
            <label htmlFor="selectedDrawingLayerColor">Color: </label>
            <input
              id="selectedDrawingLayerColor"
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="selectedDrawingLayerStrokeWidth">Stroke: </label>{' '}
            <input
              id="selectedDrawingLayerStrokeWidth"
              type="range"
              name="cowbell"
              min="0"
              max="100"
              value={selectedStrokeWidth}
              onChange={(e) => setSelectedStrokeWidth(+e.target.value)}
              step="1"
            />
          </div>
        </div>
      </div>
      <div>
        <h2>{t('drawingLayerForm:tools_title')}</h2>
        <div className="flex flex-row gap-1">
          <IconButton
            className={'active'}
            isToolboxIcon={true}
            onClick={() => {
              drawingLayerActivateFreeDrawing();
              setStatusPanelContent(
                <DrawingLayerStatusPanelContent text={t('drawingLayerForm:draw_free_line_hint')} />,
              );
            }}
            title={t('drawingLayerForm:draw_free_line_tooltip')}
          >
            <LineIcon></LineIcon>
          </IconButton>
          <IconButton
            isToolboxIcon={true}
            onClick={() => {
              drawingLayerActivateRectangleDrawing();
              setStatusPanelContent(
                <DrawingLayerStatusPanelContent text={t('drawingLayerForm:draw_ellipse_hint')} />,
              );
            }}
            title={t('drawingLayerForm:draw_rectangle_tooltip')}
          >
            <RectangleIcon></RectangleIcon>
          </IconButton>

          <IconButton
            isToolboxIcon={true}
            onClick={() => {
              drawingLayerActivateDrawEllipse();
              setStatusPanelContent(
                <DrawingLayerStatusPanelContent text={t('drawingLayerForm:draw_rectangle_hint')} />,
              );
            }}
            title={t('drawingLayerForm:draw_ellipse_tooltip')}
          >
            <CircleIcon></CircleIcon>
          </IconButton>
        </div>
      </div>
    </>
  );
}

function DrawingLayerStatusPanelContent(props: { text: string }) {
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
