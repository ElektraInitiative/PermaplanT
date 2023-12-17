import { PublicNextcloudKonvaImage } from '@/features/map_planning/components/image/PublicNextcloudKonvaImage';
import useMapStore from '@/features/map_planning/store/MapStore';
import { COLOR_PRIMARY_400 } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { Circle, Group } from 'react-konva';

const CURSOR_WIDTH = 60;
type Position = { x: number; y: number };
type Size = { width: number; height: number };

const CURSOR_SIZE: Size = { width: CURSOR_WIDTH, height: CURSOR_WIDTH };
const IMAGE_OFFSET: Position = { x: (CURSOR_WIDTH * 0.9) / 2, y: (CURSOR_WIDTH * 0.9) / 2 };
const IMAGE_SIZE: Size = { width: CURSOR_WIDTH * 0.9, height: CURSOR_WIDTH * 0.9 };

export function PlantCursor() {
  const stage = useMapStore((s) => s.stageRef?.current);
  const selectedPlantForPlanting = useMapStore(
    (s) => s.untrackedState.layers.plants.selectedPlantForPlanting,
  );
  const [pos, setPos] = useState<Position | null>(null);

  useEffect(() => {
    if (!stage || !selectedPlantForPlanting) return;

    stage.on('mousemove.plants', () => {
      const pos = stage.getRelativePointerPosition();
      setPos(pos);
    });

    return () => {
      stage.off('mousemove.plants');
    };
  }, [stage, selectedPlantForPlanting]);

  useEffect(() => {
    if (!selectedPlantForPlanting) {
      setPos(null);
    }
  }, [selectedPlantForPlanting]);

  if (!selectedPlantForPlanting || !pos) return null;

  return (
    <Group {...pos} opacity={0.7}>
      <Circle fill={COLOR_PRIMARY_400} {...CURSOR_SIZE} />
      <PublicNextcloudKonvaImage
        {...IMAGE_SIZE}
        offset={IMAGE_OFFSET}
        shareToken="2arzyJZYj2oNnHX"
        path={`Icons/${selectedPlantForPlanting?.plant.unique_name}.png`}
        showErrorMessage={true}
      />
    </Group>
  );
}
