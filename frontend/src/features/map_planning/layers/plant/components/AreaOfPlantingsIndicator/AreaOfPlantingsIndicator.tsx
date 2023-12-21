import { useSelectedPlantForPlanting } from '../../hooks/useSelectedPlantForPlanting';
import { calculatePlantCount, getPlantWidth } from '../../util';
import style from './AreaOfPlantingsIndicator.module.css';
import useMapStore from '@/features/map_planning/store/MapStore';
import { colors } from '@/utils/colors';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Html } from 'react-konva-utils';

export function AreaOfPlantingsIndicator() {
  const selectionRectAttributes = useMapStore((state) => state.selectionRectAttributes);
  const selectedPlant = useSelectedPlantForPlanting();
  const stage = useMapStore((store) => store.stageRef.current);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const isVisible = selectedPlant !== null && selectionRectAttributes.isVisible;

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

    setPos({ x: selectionRectAttributes.x, y: selectionRectAttributes.y });
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
        fieldWidth={selectionRectAttributes.width}
        fieldHeight={selectionRectAttributes.height}
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
  const { t } = useTranslation(['common', 'layers']);
  const { horizontalPlantCount, verticalPlantCount } = calculatePlantCount(
    plantWidth,
    fieldWidth,
    fieldHeight,
  );

  const unitIsMeters = Math.min(fieldWidth, fieldHeight) > 100;
  const unit = unitIsMeters ? t('meter_shorthand') : t('centimeter_shorthand');

  return (
    <>
      <span className="font-mono">{formatLength(fieldWidth, unitIsMeters)}</span>
      <span className="text-center font-mono">&times;</span>
      <span className="text-right font-mono">{formatLength(fieldHeight, unitIsMeters)}</span>
      <span className="font-bold">{unit}</span>
      <span className="font-mono">{horizontalPlantCount}</span>
      <span className="text-center font-mono">&times;</span>
      <span className="text-right font-mono">{verticalPlantCount}</span>
      <span className="font-bold">{t('layers:plants')}</span>
    </>
  );
}

function formatLength(length: number, unitIsMeters: boolean) {
  return unitIsMeters ? (length / 100).toFixed(2) : length.toFixed(0);
}
