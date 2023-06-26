import useMapStore from '@/features/map_planning/store/MapStore';
import Konva from 'konva';
import { Circle, Group, Line } from 'react-konva';

/**
 * A virtual ruler that is used to measure distances on the base layer.
 *
 * @param config propagates layer settings from the map view
 * @constructor
 */
export const MeasurementGroup = (config: Konva.LayerConfig) => {
  const untrackedState = useMapStore((state) => state.untrackedState.layers.base);

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

  return (
    <Group width={config.width} height={config.height}>
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
    </Group>
  );
};
