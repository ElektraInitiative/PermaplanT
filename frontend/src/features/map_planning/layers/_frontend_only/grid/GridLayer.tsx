import useMapStore from '@/features/map_planning/store/MapStore';
import Konva from 'konva/cmj';
import { useTranslation } from 'react-i18next';
import { Layer, Group, Line, Text } from 'react-konva';

const TEN_CENTIMETERS = 10;
const ONE_METER = 100;

// Sizes are relative to the viewport width.
// E.g.: 1 / 500 would result in a width of 2px with a 1000px viewport.
const RELATIVE_DOT_SIZE = 1 / 500;

const RELATIVE_YARD_STICK_STROKE_WIDTH = 1 / 1000;

const RELATIVE_YARD_STICK_OFFSET_X = 1 / 20;
const RELATIVE_YARD_STICK_OFFSET_Y = 1 / 30;

const RELATIVE_YARD_STICK_LABEL_OFFSET_Y = 1 / 120;

// These colors should ideally be imported from tailwind.config.js
//
// However, the official guide (https://tailwindcss.com/docs/configuration#referencing-in-java-script)
// does not seem to work with our current setup.
//
// Reason: tailwind.config.js is a commonjs module.
// Importing it with our current build setup - as suggested in the guide above -
// will result in browser errors.
const SEA_BLUE_500 = '#007499';

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

  const gridDotSize = rect.width * RELATIVE_DOT_SIZE;

  // Draw the grid larger than necessary to avoid artifacts while panning the viewport.
  const startX = -rect.x - rect.width - ((-rect.x - rect.width) % gridStep);
  const startY = -rect.y - rect.height - ((-rect.y - rect.height) % gridStep);

  const endX = -rect.x + rect.width * 2;
  const endY = -rect.y + rect.height * 2;

  const lines = [];
  for (let y = startY; y < endY; y += gridStep) {
    lines.push(
      <Line
        strokeWidth={gridDotSize}
        stroke={SEA_BLUE_500}
        points={[startX, y, endX, y]}
        dash={[gridDotSize, gridStep - gridDotSize]}
      ></Line>,
    );
  }

  return <Group>{lines}</Group>;
};

const YardStick = (rect: GridProps) => {
  const { t } = useTranslation('common');

  let yardStickLength = TEN_CENTIMETERS;
  let yardStickLengthLabel = '10' + t('centimeter_shorthand');

  if (rect.width > 100 * ONE_METER) {
    yardStickLength = 10 * ONE_METER;
    yardStickLengthLabel = '10' + t('meter_shorthand');
  } else if (rect.width > 1000) {
    yardStickLength = ONE_METER;
    yardStickLengthLabel = '1' + t('meter_shorthand');
  }

  const strokeWidth = rect.width * RELATIVE_YARD_STICK_STROKE_WIDTH;

  const lineStartX = -rect.x + rect.width * RELATIVE_YARD_STICK_OFFSET_X;
  const lineEndX = -rect.x + rect.width * RELATIVE_YARD_STICK_OFFSET_X + yardStickLength;

  const lineY = -rect.y + rect.width * RELATIVE_YARD_STICK_OFFSET_Y;

  const textX = lineStartX;
  const textY = lineY + rect.width * RELATIVE_YARD_STICK_LABEL_OFFSET_Y;

  return (
    <Group>
      <Line
        strokeWidth={strokeWidth}
        stroke={'#D0D0D0'}
        points={[lineStartX, lineY, lineEndX, lineY]}
      />
      <Text
        x={textX}
        y={textY}
        fill={'#D0D0D0'}
        text={yardStickLengthLabel}
        fontSize={strokeWidth * 10}
      />
    </Group>
  );
};
