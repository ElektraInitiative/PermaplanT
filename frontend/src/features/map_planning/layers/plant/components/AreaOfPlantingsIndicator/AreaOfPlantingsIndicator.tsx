import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Html } from 'react-konva-utils';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useTransformerStore } from '@/features/map_planning/store/transformer/TransformerStore';
import { isOneAreaOfPlanting } from '@/features/map_planning/utils/planting-utils';
import { colors } from '@/utils/colors';
import { useFindPlantById } from '../../hooks/plantHookApi';
import { useSelectedPlantForPlanting } from '../../hooks/useSelectedPlantForPlanting';
import { calculatePlantCount, getPlantWidth } from '../../util';
import style from './AreaOfPlantingsIndicator.module.css';

function useIndicatorWhilePlanting() {
  const isSelecting = useMapStore(
    (state) =>
      state.untrackedState.layers.plants.selectedPlantForPlanting &&
      state.selectionRectAttributes.isVisible &&
      Math.floor(state.selectionRectAttributes.width) > 0 &&
      Math.floor(state.selectionRectAttributes.height) > 0,
  );
  const selection = useMapStore((state) => state.selectionRectAttributes);
  const selectedPlant = useSelectedPlantForPlanting();
  const stage = useMapStore((state) => state.stageRef.current);

  if (!isSelecting || !selectedPlant || !stage) return null;
  const mousePos = stage.getRelativePointerPosition();

  return {
    x: mousePos.x,
    y: mousePos.y,
    width: selection.width,
    height: selection.height,
    plantWidth: getPlantWidth(selectedPlant.plant),
  };
}

const TRANSFORM_EVENT = 'transform.areaOfPlantings';

function useIndicatorWhileResizingAreaOfPlantings() {
  const transformerActions = useTransformerStore((state) => state.actions);
  const isResizingAreaOfPlantings = useMapStore(
    (state) =>
      isOneAreaOfPlanting(state.untrackedState.layers.plants.selectedPlantings) &&
      transformerActions.isTransforming(),
  );
  const selectedPlantings = useMapStore(
    (store) => store.untrackedState.layers.plants.selectedPlantings,
  );
  const selectedPlanting = selectedPlantings?.[0];
  const { data: plant } = useFindPlantById({
    plantId: selectedPlanting?.plantId as number,
    enabled: Boolean(selectedPlanting?.plantId),
  });
  const selectedPlantingNode = transformerActions.getSelection()[0];
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!selectedPlantingNode) return;

    selectedPlantingNode.on(TRANSFORM_EVENT, function (this) {
      const width = this.width() * this.scaleX();
      const height = this.height() * this.scaleY();

      setPos({ x: this.x() + width, y: this.y() });
      setWidth(width);
      setHeight(height);
    });

    return () => {
      selectedPlantingNode.off(TRANSFORM_EVENT);
    };
  }, [selectedPlantingNode]);

  if (!isResizingAreaOfPlantings || !selectedPlanting || !plant || !selectedPlantingNode) {
    return null;
  }

  return {
    x: pos.x,
    y: pos.y,
    width: width,
    height: height,
    plantWidth: getPlantWidth(plant),
  };
}

export function AreaOfPlantingsIndicator() {
  const indicatorDataPlanting = useIndicatorWhilePlanting();
  const indicatorDataResize = useIndicatorWhileResizingAreaOfPlantings();
  const stage = useMapStore((store) => store.stageRef.current);

  const indicatorData = indicatorDataPlanting ?? indicatorDataResize;
  if (!indicatorData || !stage) return null;

  return (
    <Html
      groupProps={{
        x: indicatorData.x,
        y: indicatorData.y,
        scaleX: 1 / stage.scaleX(),
        scaleY: 1 / stage.scaleY(),
        offsetX: -15,
        offsetY: 25,
        visible: true,
        listening: false,
      }}
      divProps={{
        className: `${style.info_text__container}`,
        style: { backgroundColor: colors.secondary[200], opacity: 0.7 },
      }}
    >
      <PlacementInfoTooltip
        areaOfPlantingsWidth={indicatorData.width}
        areaOfPlantingsHeight={indicatorData.height}
        plantWidth={indicatorData.plantWidth}
      />
    </Html>
  );
}

function PlacementInfoTooltip({
  areaOfPlantingsWidth,
  areaOfPlantingsHeight,
  plantWidth,
}: {
  areaOfPlantingsWidth: number;
  areaOfPlantingsHeight: number;
  plantWidth: number;
}) {
  const { t } = useTranslation(['common', 'areaOfPlantingsIndicator']);
  const { perRow: horizontalPlantCount, perColumn: verticalPlantCount } = calculatePlantCount(
    plantWidth,
    areaOfPlantingsWidth,
    areaOfPlantingsHeight,
  );

  const totalPlantCount = horizontalPlantCount * verticalPlantCount;

  return (
    <>
      <span className="text-right font-mono">{areaOfPlantingsWidth.toFixed(0)}</span>
      <span className="text-center font-mono">&times;</span>
      <span className="text-right font-mono">{areaOfPlantingsHeight.toFixed(0)}</span>
      <span className="font-bold">{t('centimeter_shorthand')}</span>
      <span className="text-right font-mono">{horizontalPlantCount}</span>
      <span className="text-center font-mono">&times;</span>
      <span className="text-right font-mono">{verticalPlantCount}</span>
      <span className="font-bold">
        = {totalPlantCount} {t('areaOfPlantingsIndicator:plant', { count: totalPlantCount })}
      </span>
    </>
  );
}
