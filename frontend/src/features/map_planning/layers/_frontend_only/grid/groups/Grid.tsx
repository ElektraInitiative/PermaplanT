import { Group, Line } from 'react-konva';
import { calculateGridStep } from '@/features/map_planning/layers/_frontend_only/grid/util/Calculations';
import { RELATIVE_DOT_SIZE } from '@/features/map_planning/layers/_frontend_only/grid/util/Constants';
import { ViewRect } from '@/features/map_planning/store/MapStoreTypes';
import { colors } from '@/utils/colors';

export const Grid = (rect: ViewRect) => {
  const gridStep = calculateGridStep(rect.width);

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
        stroke={colors.secondary[500]}
        points={[startX, y, endX, y]}
        dash={y !== 0 ? [gridDotSize / 2, gridStep - gridDotSize, gridDotSize / 2, 0] : []}
        key={`grid-line-y-${y}`}
      ></Line>,
    );
  }

  return (
    <Group>
      {lines}
      {/* Forms a cross with the solid line at y = 0 to indicate where the origin is. */}
      <Line
        strokeWidth={gridDotSize}
        stroke={colors.secondary[500]}
        points={[0, startY, 0, endY]}
        key={`grid-line-x`}
      ></Line>
    </Group>
  );
};
