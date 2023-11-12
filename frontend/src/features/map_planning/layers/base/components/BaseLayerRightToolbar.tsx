import { UpdateBaseLayerAction } from '../../../layers/base/actions';
import { BaseLayerImageDto } from '@/api_types/definitions';
import {
  BaseLayerAttributeEditForm,
  BaseLayerAttributeEditFormDataAttributes,
} from '@/features/map_planning/layers/base/components/BaseLayerAttributeEditForm';
import {
  BaseLayerDistanceModalAttributes,
  DistanceMeasurementModal,
} from '@/features/map_planning/layers/base/components/DistanceMeasurementModal';
import { calculateDistance, calculateScale } from '@/features/map_planning/layers/base/util';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useIsReadOnlyMode } from '@/features/map_planning/utils/ReadOnlyModeContext';
import { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

class ValidationError extends Error {
  constructor(msg: string) {
    super(msg);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

function validateBaseLayerOptions(baseLayerOptions: Omit<BaseLayerImageDto, 'action_id'>) {
  const { id, layer_id, path, rotation, scale } = baseLayerOptions;
  if (!id) {
    console.error(new ValidationError('BaseLayer validation error: id is invalid'));
    return false;
  }
  if (!layer_id) {
    console.error(new ValidationError('BaseLayer validation error: layer_id is invalid'));
    return false;
  }
  if (!path) {
    console.error(new ValidationError('BaseLayer validation error: path is invalid'));
    return false;
  }
  if (rotation === undefined || rotation === null) {
    console.error(new ValidationError('BaseLayer validation error: rotation is invalid'));
    return false;
  }
  if (scale === undefined || scale === null) {
    console.error(new ValidationError('BaseLayer validation error: scale is invalid'));
    return false;
  }

  return true;
}

export const BaseLayerRightToolbar = () => {
  const { t } = useTranslation(['common', 'baseLayerForm']);
  const isReadOnlyMode = useIsReadOnlyMode();

  const baseLayerState = useMapStore((state) => state.trackedState.layers.base);
  const { measureStep, measurePoint1, measurePoint2 } = useMapStore(
    (state) => state.untrackedState.layers.base,
  );
  const executeAction = useMapStore((state) => state.executeAction);
  const step = useMapStore((state) => state.step);
  const deactivateMeasurement = useMapStore((state) => state.baseLayerDeactivateMeasurement);
  const clearStatusPanelContent = useMapStore((state) => state.clearStatusPanelContent);

  const onBaseLayerFormChange = ({
    scale,
    rotation,
    path,
  }: BaseLayerAttributeEditFormDataAttributes) => {
    const baseLayerOptions = {
      id: baseLayerState.imageId,
      layer_id: baseLayerState.layerId,
      path: path,
      rotation: rotation,
      scale: scale,
    };

    if (validateBaseLayerOptions(baseLayerOptions))
      executeAction(new UpdateBaseLayerAction(baseLayerOptions));
  };

  const onDistanceModalSubmit: SubmitHandler<BaseLayerDistanceModalAttributes> = (attributes) => {
    clearStatusPanelContent();

    const point1 = measurePoint1 ?? { x: 0, y: 0 };
    const point2 = measurePoint2 ?? { x: 0, y: 0 };

    const measuredDistance = calculateDistance(point1, point2);
    const actualDistance = attributes.meters * 100 + attributes.centimeters;
    if (actualDistance === 0) {
      toast.error(t('baseLayerForm:error_actual_distance_zero'));
      return;
    }

    const scale = calculateScale(measuredDistance, baseLayerState.scale, actualDistance);

    const baseLayerOptions = {
      id: baseLayerState.imageId,
      layer_id: baseLayerState.layerId,
      path: baseLayerState.nextcloudImagePath,
      rotation: baseLayerState.rotation,
      scale: scale,
    };

    if (validateBaseLayerOptions(baseLayerOptions))
      executeAction(new UpdateBaseLayerAction(baseLayerOptions));

    deactivateMeasurement();
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <DistanceMeasurementModal
        onSubmit={onDistanceModalSubmit}
        onCancel={deactivateMeasurement}
        show={measureStep === 'both selected'}
      />
      <BaseLayerAttributeEditForm
        // remount the form when the selected planting or the step changes (on undo/redo)
        key={`${baseLayerState.id}-${step}`}
        onChange={onBaseLayerFormChange}
        isReadOnlyMode={isReadOnlyMode}
      />
    </div>
  );
};

export default BaseLayerRightToolbar;
