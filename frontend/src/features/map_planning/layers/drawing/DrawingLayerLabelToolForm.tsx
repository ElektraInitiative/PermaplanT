import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '@/components/Button/IconButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import useMapStore from '@/features/map_planning/store/MapStore';
import useDebounceEffect from '@/hooks/useDebounceEffect';
import TextIcon from '@/svg/icons/text.svg?react';
import { useTransformerStore } from '../../store/transformer/TransformerStore';
import { DrawingLayerStatusPanelContent } from './DrawingLayerStatusPanelContent';
import { DrawingShapeType } from './types';

export function DrawingLayerLabelToolForm() {
  const { t } = useTranslation(['common', 'drawings']);

  const drawingLayerActivateDrawingMode = useMapStore(
    (state) => state.drawingLayerActivateDrawingMode,
  );

  const transformerActions = useTransformerStore().actions;
  const selectedShape = useMapStore((state) => state.untrackedState.layers.drawing.shape);
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
            renderAsActive={selectedShape === 'text'}
            onClick={() => {
              activateDrawingMode('text');
              setStatusPanelContent(
                <DrawingLayerStatusPanelContent text={t('drawings:draw_bezier_polygon_hint')} />,
              );
            }}
            title={t('drawings:draw_bezier_polygon_tooltip')}
          >
            <TextIcon></TextIcon>
          </IconButton>
        </div>
      </div>

      <hr className="my-4 border-neutral-700" />

      <LabelTestPropertyForm />
    </>
  );
}

function LabelTestPropertyForm(): ReactElement {
  const { t } = useTranslation(['drawings']);

  const setSelectedColor = useMapStore((state) => state.drawingLayerSetSelectedColor);

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
      <div>
        <SimpleFormInput
          id="color"
          type="color"
          className="mb-4"
          labelContent={t('drawings:color')}
          onChange={(e) => setPickerColor(e.target.value)}
          value={pickerColor}
        />
      </div>
    </>
  );
}
