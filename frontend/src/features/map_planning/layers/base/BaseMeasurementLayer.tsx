import useMapStore from '@/features/map_planning/store/MapStore';
import Konva from 'konva';
import { Circle, Layer, Rect, Line } from 'react-konva';

import KonvaEventObject = Konva.KonvaEventObject;

/**
 * A virtual ruler that is used to measure distances on the base layer.
 *
 * @param config propagates layer settings from the map view
 * @constructor
 */
export const BaseMeasurementLayer = (config: Konva.LayerConfig) => {
  const {measurePoint1, measurePoint2, measureStep} = useMapStore((state) => state.untrackedState.layers.base);
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
      listening={
        measureStep !== 'inactive' && measureStep !== 'both selected'
      }
      width={config.width}
      height={config.height}
      onClick={measurementOnClick}
    >
      <Rect width={9999999} height={9999999} x={0} y={0} color="red" />
      <Line points={measurementLinePoints()} strokeWidth={10} stroke="red" lineCap={'round'} />
      {measurePoint1 && (
        <Circle
          fill="red"
          radius={10}
          x={measurePoint1?.x}
          y={measurePoint1?.y}
        />
      )}
      {measurePoint2 && (
        <Circle
          fill="red"
          radius={10}
          x={measurePoint2?.x}
          y={measurePoint2?.y}
        />
      )}
    </Layer>
  );
};
