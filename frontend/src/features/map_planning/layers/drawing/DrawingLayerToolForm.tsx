import IconButton from '@/components/Button/IconButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import {
  KEYBINDINGS_SCOPE_DRAWING_LAYER,
  createKeyBindingsAccordingToConfig,
} from '@/config/keybindings';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useKeyHandlers } from '@/hooks/useKeyHandlers';
import CircleIcon from '@/svg/icons/plant.svg?react';
import CloseIcon from '@/svg/icons/plant.svg?react';
import RectangleIcon from '@/svg/icons/plant.svg?react';
import LineIcon from '@/svg/icons/plant.svg?react';
import { ReactElement } from 'react';
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

  const selectedShape = useMapStore((state) => state.untrackedState.layers.drawing.shape);
  const setStatusPanelContent = useMapStore((state) => state.setStatusPanelContent);

  return (
    <>
      <div>
        <h2>{t('drawingLayerForm:tools_title')}</h2>
        <div className="flex flex-row gap-1">
          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedShape === 'free'}
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
            renderAsActive={selectedShape === 'rectangle'}
            onClick={() => {
              drawingLayerActivateRectangleDrawing();
              setStatusPanelContent(
                <DrawingLayerStatusPanelContent text={t('drawingLayerForm:draw_rectangle_hint')} />,
              );
            }}
            title={t('drawingLayerForm:draw_rectangle_tooltip')}
          >
            <RectangleIcon></RectangleIcon>
          </IconButton>

          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedShape === 'ellipse'}
            onClick={() => {
              drawingLayerActivateDrawEllipse();
              setStatusPanelContent(
                <DrawingLayerStatusPanelContent text={t('drawingLayerForm:draw_ellipse_hint')} />,
              );
            }}
            title={t('drawingLayerForm:draw_ellipse_tooltip')}
          >
            <CircleIcon></CircleIcon>
          </IconButton>
        </div>
      </div>

      <hr className="my-4 border-neutral-700" />

      <ShapePropertyForm selectedShape={selectedShape} />
    </>
  );
}

function ShapePropertyForm(props: { selectedShape: string | null }): ReactElement {
  const setSelectedColor = useMapStore((state) => state.drawingLayerSetSelectedColor);
  const setSelectedStrokeWidth = useMapStore((state) => state.drawingLayerSetSelectedStrokeWidth);
  const selectedColor = useMapStore((state) => state.untrackedState.layers.drawing.selectedColor);
  const selectedStrokeWidth = useMapStore(
    (state) => state.untrackedState.layers.drawing.selectedStrokeWidth,
  );

  const showStrokeProperty = props.selectedShape === 'free';

  return (
    <>
      {props.selectedShape && (
        <div>
          <SimpleFormInput
            id="rotation"
            className="mb-3"
            type="color"
            labelContent={'Color'}
            onChange={(e) => setSelectedColor(e.target.value)}
            value={selectedColor}
          />

          {showStrokeProperty && (
            <SimpleFormInput
              id="rotation"
              className="background-red"
              type="range"
              labelContent={'Stroke'}
              min={1}
              max={100}
              onChange={(e) => setSelectedStrokeWidth(+e.target.value)}
              value={selectedStrokeWidth}
            />
          )}
        </div>
      )}
    </>
  );
}

function DrawingLayerStatusPanelContent(props: { text: string }): ReactElement {
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
