import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DrawingShapeType } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import useMapStore from '@/features/map_planning/store/MapStore';
import useDebounceEffect from '@/hooks/useDebounceEffect';
import CircleIcon from '@/svg/icons/circle.svg?react';
import PolygonIcon from '@/svg/icons/polygon.svg?react';
import RectangleIcon from '@/svg/icons/rectangle.svg?react';
import LineIcon from '@/svg/icons/wavy-line.svg?react';
import { useTransformerStore } from '../../store/transformer/TransformerStore';
import { DrawingLayerFillPatterns } from './DrawingLayerFillPatterns';
import { DrawingLayerStatusPanelContent } from './DrawingLayerStatusPanelContent';

export function DrawingLayerShapesToolForm() {
  const { t } = useTranslation(['common', 'drawings']);

  const drawingLayerActivateDrawingMode = useMapStore(
    (state) => state.drawingLayerActivateDrawingMode,
  );

  const transformerActions = useTransformerStore().actions;
  const selectedShape = useMapStore((state) => state.untrackedState.layers.drawing.selectedShape);
  const setStatusPanelContent = useMapStore((state) => state.setStatusPanelContent);

  const activateDrawingMode = (shape: DrawingShapeType) => {
    drawingLayerActivateDrawingMode(shape);
    transformerActions.clearSelection();
  };

  return (
    <>
      <div>
        <div className="flex flex-row gap-1">
          <IconButton
            isToolboxIcon={true}
            renderAsActive={selectedShape === DrawingShapeType.FreeLine}
            onClick={() => {
              activateDrawingMode(DrawingShapeType.FreeLine);
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
            renderAsActive={selectedShape === DrawingShapeType.Rectangle}
            onClick={() => {
              activateDrawingMode(DrawingShapeType.Rectangle);
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
            renderAsActive={selectedShape === DrawingShapeType.Ellipse}
            onClick={() => {
              activateDrawingMode(DrawingShapeType.Ellipse);
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
            renderAsActive={selectedShape === DrawingShapeType.BezierPolygon}
            onClick={() => {
              activateDrawingMode(DrawingShapeType.BezierPolygon);
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

function ShapePropertyForm(props: { selectedShape: DrawingShapeType | null }): ReactElement {
  const { t } = useTranslation(['drawings']);

  const setSelectedColor = useMapStore((state) => state.drawingLayerSetSelectedColor);
  const setFillPattern = useMapStore((state) => state.drawingLayerSetFillPattern);
  const setSelectedStrokeWidth = useMapStore((state) => state.drawingLayerSetSelectedStrokeWidth);
  const selectedStrokeWidth = useMapStore(
    (state) => state.untrackedState.layers.drawing.selectedStrokeWidth,
  );
  const fill = useMapStore((state) => state.untrackedState.layers.drawing.fillPattern);

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

          <DrawingLayerFillPatterns
            onChange={setFillPattern}
            selectedPattern={fill}
          ></DrawingLayerFillPatterns>
        </div>
      )}
    </>
  );
}
