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
  const untrackedState = useMapStore((state) => state.untrackedState.layers.base);
  const setMeasurePoint = useMapStore((state) => state.baseLayerSetMeasurePoint);

  const measurementLinePoints = () => {
    if (untrackedState.measureStep !== 'both selected') return [];

    console.assert(untrackedState.measurePoint1 !== null);
    console.assert(untrackedState.measurePoint2 !== null);
    return [
      untrackedState.measurePoint1?.x ?? Number.NaN,
      untrackedState.measurePoint1?.y ?? Number.NaN,
      untrackedState.measurePoint2?.x ?? Number.NaN,
      untrackedState.measurePoint2?.y ?? Number.NaN,
    ];
  };

  const measurementOnClick = (e: KonvaEventObject<MouseEvent>) => {
    const position = e.currentTarget.getRelativePointerPosition();
    setMeasurePoint(position);
  };

  return (
    <Layer
      listening={
        untrackedState.measureStep !== 'inactive' && untrackedState.measureStep !== 'both selected'
      }
      width={config.width}
      height={config.height}
      onClick={measurementOnClick}
    >
      <Rect width={9999999} height={9999999} x={0} y={0} color="red" />
      <Line points={measurementLinePoints()} strokeWidth={10} stroke="red" lineCap={'round'} />
      {untrackedState.measurePoint1 && (
        <Circle
          fill="red"
          radius={10}
          x={untrackedState.measurePoint1?.x}
          y={untrackedState.measurePoint1?.y}
        />
      )}
      {untrackedState.measurePoint2 && (
        <Circle
          fill="red"
          radius={10}
          x={untrackedState.measurePoint2?.x}
          y={untrackedState.measurePoint2?.y}
        />
      )}
    </Layer>
  );
};
