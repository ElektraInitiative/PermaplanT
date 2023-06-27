import useMapStore from '@/features/map_planning/store/MapStore';
import Konva from 'konva';
import { Circle, Layer, Rect, Line } from 'react-konva';

import KonvaEventObject = Konva.KonvaEventObject;
import {BASE_LAYER_MEASUREMENT_RECT_WIDTH} from "@/features/map_planning/utils/Constants";

/**
 * A virtual ruler that is used to measure distances on the base layer.
 *
 * @param config propagates layer settings from the map view
 * @constructor
 */
export const BaseMeasurementLayer = () => {
  const { measurePoint1, measurePoint2, measureStep } = useMapStore(
    (state) => state.untrackedState.layers.base,
  );
  const setMeasurePoint = useMapStore((state) => state.baseLayerSetMeasurePoint);

  const measurementLinePoints = () => {
    if (measureStep !== 'both selected') return [];

    console.assert(measurePoint1 !== null);
    console.assert(measurePoint2 !== null);
    return [
      measurePoint1?.x ?? Number.NaN,
      measurePoint1?.y ?? Number.NaN,
      measurePoint2?.x ?? Number.NaN,
      measurePoint2?.y ?? Number.NaN,
    ];
  };

  const measurementOnClick = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    setMeasurePoint(position);
  };

  return (
    <Layer
      listening={measureStep !== 'inactive' && measureStep !== 'both selected'}
      onClick={measurementOnClick}
    >
      <Rect
          width={BASE_LAYER_MEASUREMENT_RECT_WIDTH}
          height={BASE_LAYER_MEASUREMENT_RECT_WIDTH}
          x={-BASE_LAYER_MEASUREMENT_RECT_WIDTH / 2}
          y={-BASE_LAYER_MEASUREMENT_RECT_WIDTH / 2}
      />
      <Line points={measurementLinePoints()} strokeWidth={10} stroke="red" lineCap={'round'} />
      {measurePoint1 && <Circle fill="red" radius={10} x={measurePoint1?.x} y={measurePoint1?.y} />}
      {measurePoint2 && <Circle fill="red" radius={10} x={measurePoint2?.x} y={measurePoint2?.y} />}
    </Layer>
  );
};
