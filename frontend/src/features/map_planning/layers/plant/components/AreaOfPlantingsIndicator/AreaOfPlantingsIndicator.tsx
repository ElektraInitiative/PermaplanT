import { useSelectedPlantForPlanting } from '../../hooks/useSelectedPlantForPlanting';
import { calculatePlantCount, getPlantWidth } from '../../util';
import style from './AreaOfPlantingsIndicator.module.css';
import useMapStore from '@/features/map_planning/store/MapStore';
import { colors } from '@/utils/colors';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Group, Label, Tag } from 'react-konva';
import { Html } from 'react-konva-utils';

export function AreaOfPlantingsIndicator() {
  const selectionRectAttributes = useMapStore((state) => state.selectionRectAttributes);
  const selectedPlant = useSelectedPlantForPlanting();
  const stage = useMapStore((store) => store.stageRef.current);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const isVisible = selectedPlant !== null && selectionRectAttributes.isVisible;

  useEffect(() => {
    if (!isVisible || !stage) return;

    stage.on('mousemove.areaOfPlantingsIndicator', () => {
      const pos = stage.getRelativePointerPosition();
      if (pos === null) return;

      setPos(pos);
    });

    return () => {
      stage.off('mousemove.areaOfPlantingsIndicator');
    };
  }, [isVisible, stage]);

  useLayoutEffect(() => {
    if (!isVisible) return;

    setPos({ x: selectionRectAttributes.x, y: selectionRectAttributes.y });
    // we only want to run this if isVisible changes, then we are only interested in the latest value of selectionRectAttributes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  if (!isVisible) return null;

  const plantWidth = getPlantWidth(selectedPlant.plant);
  const scaleX = stage?.scaleX() ?? 1;
  const scaleY = stage?.scaleY() ?? 1;

  return (
    <Group
      {...pos}
      offsetX={-15 / scaleX}
      offsetY={25 / scaleY}
      visible={isVisible}
      listening={false}
    >
      <Label>
        <Tag fill={colors.secondary[200]} />
        <Html
          divProps={{
            className: `${style.info_text__container}`,
            style: { pointerEvents: 'none', backgroundColor: colors.secondary[200] },
          }}
        >
          <InfoTextLabel
            fieldWidth={selectionRectAttributes.width}
            fieldHeight={selectionRectAttributes.height}
            plantWidth={plantWidth}
          />
        </Html>
      </Label>
    </Group>
  );
}

function InfoTextLabel({
  fieldWidth,
  fieldHeight,
  plantWidth,
}: {
  fieldWidth: number;
  fieldHeight: number;
  plantWidth: number;
}) {
  const { horizontalPlantCount, verticalPlantCount } = calculatePlantCount(
    plantWidth,
    fieldWidth,
    fieldHeight,
  );

  return (
    <>
      <span className="text-right">
        {horizontalPlantCount} x {verticalPlantCount}
      </span>
      <span className="font-bold">plants</span>
      <span className="text-right">{plantWidth}</span>
      <span className="font-bold">cm</span>
      <span className="text-right">
        {fieldWidth} x {fieldHeight}
      </span>
      <span className="font-bold">cm</span>
    </>
  );
}
