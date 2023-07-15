import {useTranslation} from "react-i18next";
import {Group, Line, Text} from "react-konva";
import {
    RELATIVE_YARD_STICK_LABEL_OFFSET_Y, RELATIVE_YARD_STICK_OFFSET_X, RELATIVE_YARD_STICK_OFFSET_Y,
    RELATIVE_YARD_STICK_STROKE_WIDTH,
} from "@/features/map_planning/layers/_frontend_only/grid/util/Constants";
import {BoundsRect} from "@/features/map_planning/store/MapStoreTypes";
import {ONE_METER, TEN_CENTIMETERS} from "@/features/map_planning/utils/Constants";

export const YardStick = (rect: BoundsRect) => {
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
