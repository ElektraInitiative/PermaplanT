import { useSelectedPlantForPlanting } from '../../hooks/useSelectedPlantForPlanting';
import { calculatePlantCount, getPlantWidth } from '../../util';
import style from './AreaOfPlantingsIndicator.module.css';
import useMapStore from '@/features/map_planning/store/MapStore';
import { colors } from '@/utils/colors';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Html } from 'react-konva-utils';

export function AreaOfPlantingsIndicator() {
  const selection = useMapStore((state) => state.selectionRectAttributes);
  const selectedPlant = useSelectedPlantForPlanting();
  const stage = useMapStore((store) => store.stageRef.current);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const selectionWidth = Math.floor(selection.width);
  const selectionHeight = Math.floor(selection.height);

  const isVisible =
    selectedPlant !== null && selection.isVisible && selectionWidth > 0 && selectionHeight > 0;

  useEffect(() => {
    if (!stage) return;

    stage.on('mousemove.areaOfPlantingsIndicator', () => {
      if (!isVisible) return;

      const pos = stage.getRelativePointerPosition();
      if (pos === null) return;

      setPos(pos);
    });

    return () => {
      stage.off('mousemove.areaOfPlantingsIndicator');
    };
  }, [isVisible, stage]);

  useLayoutEffect(() => {
    // before showing the tooltip, place it where the selection rect is
    if (!isVisible) return;

    setPos({ x: selection.x, y: selection.y });
    // we only want to run this if isVisible changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  if (!isVisible) return null;

  const plantWidth = getPlantWidth(selectedPlant.plant);
  const scaleX = stage?.scaleX() ?? 1;
  const scaleY = stage?.scaleY() ?? 1;

  return (
    <Html
      groupProps={{
        ...pos,
        scaleX: 1 / scaleX,
        scaleY: 1 / scaleY,
        offsetX: -15,
        offsetY: 25,
        visible: true,
        listening: false,
      }}
      divProps={{
        className: `${style.info_text__container}`,
        style: { backgroundColor: colors.secondary[200] },
      }}
    >
      <PlacementInfoTooltip
        fieldWidth={selectionWidth}
        fieldHeight={selectionHeight}
        plantWidth={plantWidth}
      />
    </Html>
  );
}

function PlacementInfoTooltip({
  fieldWidth,
  fieldHeight,
  plantWidth,
}: {
  fieldWidth: number;
  fieldHeight: number;
  plantWidth: number;
}) {
  const { t } = useTranslation(['common', 'areaOfPlantingsIndicator']);
  const { horizontalPlantCount, verticalPlantCount } = calculatePlantCount(
    plantWidth,
    fieldWidth,
    fieldHeight,
  );

  const totalPlantCount = horizontalPlantCount * verticalPlantCount;

  return (
    <>
      <span className="text-right font-mono">{fieldWidth.toFixed(0)}</span>
      <span className="text-center font-mono">&times;</span>
      <span className="text-right font-mono">{fieldHeight.toFixed(0)}</span>
      <span className="font-bold">{t('centimeter_shorthand')}</span>
      <span className="text-right font-mono">{horizontalPlantCount}</span>
      <span className="text-center font-mono">&times;</span>
      <span className="text-right font-mono">{verticalPlantCount}</span>
      <span className="font-bold">
        = {totalPlantCount} {t('areaOfPlantingsIndicator:plantAmount', { count: totalPlantCount })}
      </span>
    </>
  );
}
