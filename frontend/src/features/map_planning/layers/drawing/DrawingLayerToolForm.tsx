import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DrawingShapeKind } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import useMapStore from '@/features/map_planning/store/MapStore';
import useDebounceEffect from '@/hooks/useDebounceEffect';
import CircleIcon from '@/svg/icons/circle.svg?react';
import PolygonIcon from '@/svg/icons/polygon.svg?react';
import RectangleIcon from '@/svg/icons/rectangle.svg?react';
import LineIcon from '@/svg/icons/wavy-line.svg?react';
import { useTransformerStore } from '../../store/transformer/TransformerStore';
import { DrawingLayerStatusPanelContent } from './DrawingLayerStatusPanelContent';

export function DrawingLayerToolForm() {
  const { t } = useTranslation(['common', 'drawings']);

  const drawingLayerActivateDrawingMode = useMapStore(
    (state) => state.drawingLayerActivateDrawingMode,
  );

  const transformerActions = useTransformerStore().actions;
  const selectedShape = useMapStore((state) => state.untrackedState.layers.drawing.selectedShape);
  const setStatusPanelContent = useMapStore((state) => state.setStatusPanelContent);

  const activateDrawingMode = (shape: DrawingShapeKind) => {
    drawingLayerActivateDrawingMode(shape);
    transformerActions.clearSelection();
  };

  return (
    <>
      <div>
        <h2>{t('drawings:tools_title')}</h2>
        <div className="flex flex-row gap-1">
          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedShape === DrawingShapeKind.FreeLine}
            onClick={() => {
              activateDrawingMode(DrawingShapeKind.FreeLine);
              setStatusPanelContent(
                <DrawingLayerStatusPanelContent text={t('drawings:draw_free_line_hint')} />,
              );
            }}
            title={t('drawings:draw_free_line_tooltip')}
          >
            <LineIcon></LineIcon>
          </IconButton>
          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedShape === DrawingShapeKind.Rectangle}
            onClick={() => {
              activateDrawingMode(DrawingShapeKind.Rectangle);
              setStatusPanelContent(
                <DrawingLayerStatusPanelContent text={t('drawings:draw_rectangle_hint')} />,
              );
            }}
            title={t('drawings:draw_rectangle_tooltip')}
          >
            <RectangleIcon></RectangleIcon>
          </IconButton>

          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedShape === DrawingShapeKind.Ellipse}
            onClick={() => {
              activateDrawingMode(DrawingShapeKind.Ellipse);
              setStatusPanelContent(
                <DrawingLayerStatusPanelContent text={t('drawings:draw_ellipse_hint')} />,
              );
            }}
            title={t('drawings:draw_ellipse_tooltip')}
          >
            <CircleIcon></CircleIcon>
          </IconButton>

          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedShape === DrawingShapeKind.BezierPolygon}
            onClick={() => {
              activateDrawingMode(DrawingShapeKind.BezierPolygon);
              setStatusPanelContent(
                <DrawingLayerStatusPanelContent text={t('drawings:draw_bezier_polygon_hint')} />,
              );
            }}
            title={t('drawings:draw_bezier_polygon_tooltip')}
          >
            <PolygonIcon></PolygonIcon>
          </IconButton>
        </div>
      </div>

      <hr className="my-4 border-neutral-700" />

      <ShapePropertyForm selectedShape={selectedShape} />
    </>
  );
}

function ShapePropertyForm(props: { selectedShape: DrawingShapeKind | null }): ReactElement {
  const { t } = useTranslation(['drawings']);

  const setSelectedColor = useMapStore((state) => state.drawingLayerSetSelectedColor);
  const setFill = useMapStore((state) => state.drawingLayerSetFillEnabled);
  const setSelectedStrokeWidth = useMapStore((state) => state.drawingLayerSetSelectedStrokeWidth);
  const selectedStrokeWidth = useMapStore(
    (state) => state.untrackedState.layers.drawing.selectedStrokeWidth,
  );
  const fill = useMapStore((state) => state.untrackedState.layers.drawing.fillEnabled);

  const [pickerColor, setPickerColor] = useState('#000000');

  useDebounceEffect(
    () => {
      setSelectedColor(pickerColor);
    },
    100,
    [pickerColor],
  );

  return (
    <>
      {props.selectedShape && (
        <div>
          <SimpleFormInput
            id="color"
            type="color"
            className="mb-4"
            labelContent={t('drawings:color')}
            onChange={(e) => setPickerColor(e.target.value)}
            value={pickerColor}
          />
          <SimpleFormInput
            id="stroke"
            className="mb-4"
            type="range"
            labelContent={t('drawings:strokeWidth')}
            min={1}
            max={100}
            onChange={(e) => setSelectedStrokeWidth(+e.target.value)}
            value={selectedStrokeWidth}
          />
          <SimpleFormInput
            id="fill"
            type="checkbox"
            className="mt-2 h-4 w-4"
            labelContent={t('drawings:fillEnabled')}
            onChange={(e) => setFill(e.target.checked)}
            checked={fill}
          />
        </div>
      )}
    </>
  );
}
