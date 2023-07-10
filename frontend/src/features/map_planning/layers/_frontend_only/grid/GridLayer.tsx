import useMapStore from '@/features/map_planning/store/MapStore';
import Konva from 'konva/cmj';
import { Layer, Group, Line, Text } from 'react-konva';

const TEN_CENTIMETERS = 10;
const ONE_METER = 100;

const RELATIVE_DOT_SIZE = 1 / 1000;

const RELATIVE_YARD_STICK_OFFSET_X = 1 / 20;
const RELATIVE_YARD_STICK_OFFSET_Y = 1 / 30;

const RELATIVE_YARD_STICK_LABEL_OFFSET_Y = 1 / 120;

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
  let gridStep = TEN_CENTIMETERS;
  if (rect.width > 100 * ONE_METER) {
    gridStep = 10 * ONE_METER;
  } else if (rect.width > 1000) {
    gridStep = ONE_METER;
  }

  let gridDotSize = rect.width * RELATIVE_DOT_SIZE;

  const startX = -rect.x - rect.width - ((-rect.x - rect.width) % gridStep);
  const startY = -rect.y - rect.height - ((-rect.y - rect.height) % gridStep);

  const endX = -rect.x + rect.width;
  const endY = -rect.y + rect.height;

  const lines = [];
  for (let y = startY; y < endY; y += gridStep) {
    lines.push(
      <Line strokeWidth={gridDotSize}
            stroke={'red'}
            points={[startX, y, endX, y]}
            dash={[gridDotSize, gridStep - gridDotSize]}></Line>,
    );
  }

  return (
    <Group>
      {lines}
    </Group>
  );
};

const YardStick = (rect: GridProps) => {
  let yardStickLength = TEN_CENTIMETERS;
  let yardStickLengthLabel = '10cm';

  if (rect.width > 100 * ONE_METER) {
    yardStickLength = 10 * ONE_METER;
    yardStickLengthLabel = '10m';
  } else if (rect.width > 1000) {
    yardStickLength = ONE_METER;
    yardStickLengthLabel = '1m';
  }

  const strokeWidth = rect.width * RELATIVE_DOT_SIZE;

  const lineStartX = -rect.x + rect.width * RELATIVE_YARD_STICK_OFFSET_X;
  const lineEndX = -rect.x + rect.width * RELATIVE_YARD_STICK_OFFSET_X + yardStickLength;

  const lineY = -rect.y + rect.width * RELATIVE_YARD_STICK_OFFSET_Y;

  const textX = lineStartX;
  const textY = lineY + (rect.width * RELATIVE_YARD_STICK_LABEL_OFFSET_Y);

  return (
    <Group>
      <Line strokeWidth={strokeWidth} stroke={'#D0D0D0'} points={[lineStartX, lineY, lineEndX, lineY]} />
      <Text x={textX} y={textY} fill={'#D0D0D0'} text={yardStickLengthLabel} fontSize={strokeWidth * 10} />
    </Group>
  );
};
