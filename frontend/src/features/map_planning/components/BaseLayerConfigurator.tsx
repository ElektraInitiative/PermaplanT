import BaseLayer from '../layers/BaseLayer';
import { MAP_PIXELS_PER_METER } from '../utils/Constants';
import { BaseStage } from './BaseStage';
import { NewBaseLayerDto } from '@/bindings/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import ModalContainer from '@/components/Modals/ModalContainer';
import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';
import { Layer, Line } from 'react-konva';
import { useTranslation } from 'react-i18next';

export interface BaseLayerConfiguratorProps {
  onSubmit: (baseLayer: NewBaseLayerDto) => void;
}

// Setting the maps scale using a known distance is handled using a state machine.
enum MeasurementState {
  Initial, // The user has not selected any points on the map.
  OnePointSelected, // A single point was selected. Display a line between the selected point and the mouse cursor.
  TwoPointsSelected, // Two points have been selected. Draw a line between both points.
}

// Expects an array of line coordinates as returned by Konva [x1, y1, x2, y2].
const calculateLineLength = (line: number[]): number => {
  console.assert(line.length === 4);

  const lineLengthX = Math.abs(line[2] - line[0]);
  const lineLengthY = Math.abs(line[3] - line[1]);

  return Math.sqrt(lineLengthX * lineLengthX + lineLengthY * lineLengthY);
};

const correctForPreviousMapScaling = (distance: number, oldScale: number): number => {
  return (distance / oldScale) * MAP_PIXELS_PER_METER;
};

// coordinates of mouse events might be null or undefined
const mouseEventX = (e: KonvaEventObject<MouseEvent>): number => {
  const value =  e.target.getStage()?.getRelativePointerPosition()?.x == null
          ? 0
          : e.target.getStage()?.getRelativePointerPosition()?.x;

  return value ?? 0;
}

const mouseEventY = (e: KonvaEventObject<MouseEvent>): number => {
  const value =  e.target.getStage()?.getRelativePointerPosition()?.y == null
      ? 0
      : e.target.getStage()?.getRelativePointerPosition()?.y;

  return value ?? 0;
}

const BaseLayerConfigurator = (props: BaseLayerConfiguratorProps) => {
  const { t } = useTranslation(['baseLayerConfigurator', 'common']); 

  const [imageUrl, setImageUrl] = useState('');
  const [rotation, setImageRotation] = useState(0);
  const [scale, setImageScale] = useState(10);
  const [realWorldLength, setRealWorldLength] = useState(0);
  
  const onUrlInputChange = (value: string | number) => {
    // TODO: add nextcloud support with error handling
    if (typeof value === 'number') return;
    setImageUrl(value);
  };

  const onRotationInputChange = (value: string | number) => {
    if (typeof value === 'string') return;
    setImageRotation(value);
  };

  const onScaleInputChange = (value: string | number) => {
    if (typeof value === 'string') return;
    setImageScale(value);
  };

  const onMetersInputChange = (value: string | number) => {
    if (typeof value === 'string' || Number.isNaN(value)) return;

    const centimeters = realWorldLength - Math.floor(realWorldLength);
    setRealWorldLength(value + centimeters);
  };

  const onCentimetersInputChange = (value: string | number) => {
    if (typeof value === 'string' || Number.isNaN(value)) return;

    const meters = Math.floor(realWorldLength);
    setRealWorldLength(meters + value / 100);
  };

  // Determine the scale of the image using the length of a known distance
  const [measureState, setMeasureState] = useState(MeasurementState.Initial);
  const [measureLinePoints, setMeasureLinePoints] = useState<number[]>([]);
  const [measuredLength, setMeasuredLength] = useState(0);

  const [showDistanceInputModal, setShowDistanceInputModal] = useState(false);

  const stateResetInitial = () => {
    setMeasureLinePoints([]);
    setMeasureState(MeasurementState.Initial);
  };

  const stateTransitionInitialOnePointSelected = (x: number, y: number) => {
    setMeasureLinePoints([x, y]);
    setMeasureState(MeasurementState.OnePointSelected);
  };

  const stateTransitionOnePointSelectedTwoPointsSelected = () => {
    console.assert(
        measureLinePoints[0] != undefined &&
        measureLinePoints[1] != undefined &&
        measureLinePoints[2] != undefined &&
        measureLinePoints[3] != undefined,
        'measureLinePoints should contain 4 defined elements.',
    );

    const lineLength = calculateLineLength(measureLinePoints);

    // compensate for previously applied scaling
    setMeasuredLength(correctForPreviousMapScaling(lineLength, scale));

    // Promt the user to input the real world length of the measured distance
    // This will complete the distance measuring process.
    setShowDistanceInputModal(true);

    setMeasureState(MeasurementState.TwoPointsSelected);
  }

  const onBaseStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return;
    // There is no point in setting the scaling if no image was selected.
    if ((imageUrl ?? '') === '') return;

    // Each click on the displayed image causes the component to advance to the next state.
    switch (measureState) {
      case MeasurementState.Initial:
        const x = mouseEventX(e);
        const y = mouseEventY(e);

        stateTransitionInitialOnePointSelected(x, y);
        break;

      case MeasurementState.OnePointSelected:
        stateTransitionOnePointSelectedTwoPointsSelected();
        break;

      case MeasurementState.TwoPointsSelected:
        stateResetInitial();
        break;
    }
  };

  const onBaseStageMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (measureState !== MeasurementState.OnePointSelected) return;

    // The user has already selected a single point on the map.
    // We continuously store the cursors position in the measureLinePoints array to get a line going from the
    // selected point to the mouse cursor.
    const x = mouseEventX(e);
    const y = mouseEventY(e);

    console.assert(
      measureLinePoints[0] != undefined && measureLinePoints[1] != undefined,
      'First measure point undefined.',
    );
    setMeasureLinePoints([measureLinePoints[0], measureLinePoints[1], x, y]);
  };

  const onDistanceInputModalSubmit = () => {
    setImageScale(measuredLength / realWorldLength);

    setShowDistanceInputModal(false);
    stateResetInitial();
  };

  const onDistanceInputModalCancel = () => {
    setShowDistanceInputModal(false);
    stateResetInitial();
  };

  return (
    <div className="pb-1">
      <ModalContainer show={showDistanceInputModal}>
        <div className="flex min-h-[200px] w-[400px] flex-col justify-between space-y-8 rounded-lg bg-neutral-100 p-6 dark:bg-neutral-100-dark">
          <h1>{t('baseLayerConfigurator:distance_modal_header')}</h1>

          <div className="space-between flex flex-row justify-center space-x-4">
            <SimpleFormInput
              id={'distance-input-meters'}
              labelText={t('common:meters')}
              type={'number'}
              min={0}
              defaultValue={0}
              onChange={onMetersInputChange}
            />
            <SimpleFormInput
              id={'distance-input-centimeters'}
              labelText={t('common:centimeters')}
              type={'number'}
              min={0}
              defaultValue={0}
              max={99}
              onChange={onCentimetersInputChange}
            />
          </div>
          <div className="space-between flex flex-row justify-center space-x-8">
            <SimpleButton onClick={onDistanceInputModalCancel} className="max-w-[240px] grow">
              Cancel
            </SimpleButton>
            <SimpleButton
              disabled={realWorldLength === 0}
              onClick={onDistanceInputModalSubmit}
              className="max-w-[240px] grow"
            >
              Submit
            </SimpleButton>
          </div>
        </div>
      </ModalContainer>

      <div className="flex-column flex items-end gap-4">
        <SimpleFormInput
          id={'url'}
          labelText={t('baseLayerConfigurator:background_image_url')}
          onChange={onUrlInputChange}
        ></SimpleFormInput>

        <SimpleFormInput
          id={'rotation'}
          labelText={t('baseLayerConfigurator:rotation_degrees')}
          onChange={onRotationInputChange}
          type={'number'}
          defaultValue={0}
          min={0}
          max={359}
          disabled={(imageUrl ?? '') === ''}
        ></SimpleFormInput>

        <SimpleFormInput
          id={'scale'}
          labelText={t('baseLayerConfigurator:pixels_per_meter')}
          onChange={onScaleInputChange}
          value={scale.toFixed(2)}
          type={'number'}
          min={1}
          disabled={(imageUrl ?? '') === ''}
        ></SimpleFormInput>

        <SimpleButton
          onClick={() =>
            props.onSubmit({
              base_image_url: imageUrl,
              pixels_per_meter: scale,
              north_orientation_degrees: rotation,
            })
          }
          className="max-w-[240px] grow py-5"
          disabled={(imageUrl ?? '') === ''}
        >
          Done
        </SimpleButton>
      </div>
      <div className="absolute left-0 mt-2">
        <BaseStage onMouseMove={onBaseStageMouseMove} onClick={onBaseStageClick}>
          <BaseLayer imageUrl={imageUrl} rotation={rotation} pixels_per_meter={scale}></BaseLayer>
          <Layer listening={false}>
            <Line points={measureLinePoints} stroke={'#ff0000'} lineWidth={10} lineCap="square" />
          </Layer>
        </BaseStage>
      </div>
    </div>
  );
};

export default BaseLayerConfigurator;
