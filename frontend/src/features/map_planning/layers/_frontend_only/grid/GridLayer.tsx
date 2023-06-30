import useMapStore from '@/features/map_planning/store/MapStore';
import Konva from 'konva/cmj';
import { Layer, Group, Line, Text } from 'react-konva';

export const GridLayer = (props: Konva.LayerConfig) => {
  const mapBounds = useMapStore((state) => state.untrackedState.editorBounds);

  return (
    <Layer listening={false} visible={props.visible} opacity={props.opacity}>
      <Grid x={mapBounds.x} y={mapBounds.y} width={mapBounds.width} height={mapBounds.height} />
      <YardStick
        x={mapBounds.x}
        y={mapBounds.y}
        width={mapBounds.width}
        height={mapBounds.height}
      />
    </Layer>
  );
};

interface GridProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

const Grid = (rect: GridProps) => {
  let step = 10;
  let dynamicStrokeWidth = rect.width / 1000;
  if (rect.width > 10000) {
    step = 1000;
  } else if (rect.width > 1000) {
    step = 100;
  }

  const startX = -rect.x - rect.width - ((-rect.x - rect.width) % step);
  const startY = -rect.y - rect.height - ((-rect.y - rect.height) % step);

  const endX = -rect.x + rect.width;
  const endY = -rect.y + rect.height;

  const lines = [];
  for (let y = startY; y < endY; y += step) {
    lines.push(
      <Line strokeWidth={dynamicStrokeWidth}
            stroke={'red'}
            points={[startX, y, endX, y]}
            dash={[dynamicStrokeWidth, step - dynamicStrokeWidth]}></Line>,
    );
  }

  return (
    <Group>
      {lines}
    </Group>
  );
};

const YardStick = (rect: GridProps) => {
  const dynamicStrokeWidth = rect.width / 1000;

  const startX = -rect.x + rect.width / 15;
  const endX = -rect.x + rect.width / 15 + 100;

  const y = -rect.y + rect.width / 15;

  return (
    <Group>
      <Line strokeWidth={dynamicStrokeWidth} stroke={'white'} points={[startX, y, endX, y]} />
      <Text x={startX} y={y} fill={'white'} text={'1m'} fontSize={dynamicStrokeWidth * 10} />
    </Group>
  );
};
