import { useTranslation } from 'react-i18next';
import { Group, Line, Text } from 'react-konva';
import { useDarkModeStore } from '@/features/dark_mode';
import {
  calculateGridStep,
  yardStickLabel,
} from '@/features/map_planning/layers/_frontend_only/grid/util/Calculations';
import {
  RELATIVE_YARD_STICK_LABEL_OFFSET_Y,
  RELATIVE_YARD_STICK_OFFSET_X,
  RELATIVE_YARD_STICK_OFFSET_Y,
  RELATIVE_YARD_STICK_STROKE_WIDTH,
} from '@/features/map_planning/layers/_frontend_only/grid/util/Constants';
import { ViewRect } from '@/features/map_planning/store/MapStoreTypes';
import { colors } from '@/utils/colors';

export const YardStick = (rect: ViewRect) => {
  const { t } = useTranslation('common');
  const { darkMode } = useDarkModeStore();

  const yardStickLength = calculateGridStep(rect.width);
  const yardStickLengthLabel = yardStickLabel(
    rect.width,
    t('meter_shorthand'),
    t('centimeter_shorthand'),
  );

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
        stroke={darkMode ? colors.neutral[700].dark : colors.neutral[700].light}
        points={[lineStartX, lineY, lineEndX, lineY]}
      />
      <Text
        x={textX}
        y={textY}
        fill={darkMode ? colors.neutral[700].dark : colors.neutral[700].light}
        text={yardStickLengthLabel}
        fontSize={strokeWidth * 10}
      />
    </Group>
  );
};
