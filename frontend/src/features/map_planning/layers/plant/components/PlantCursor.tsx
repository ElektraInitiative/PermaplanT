import { PublicNextcloudKonvaImage } from '@/features/map_planning/components/image/PublicNextcloudKonvaImage';
import useMapStore from '@/features/map_planning/store/MapStore';
import { COLOR_PRIMARY_400 } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { Circle, Group, Rect } from 'react-konva';

export function PlantCursor() {
  const stage = useMapStore((s) => s.stageRef?.current);
  const selectedPlantForPlanting = useMapStore(
    (s) => s.untrackedState.layers.plants.selectedPlantForPlanting,
  );
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const [width] = useState(60);
  const [height] = useState(60);

  useEffect(() => {
    if (!stage || !selectedPlantForPlanting) return;

    stage.on('mousemove.plants', () => {
      const pos = stage.getRelativePointerPosition();
      if (pos !== null) setPos(pos);
    });

    return () => {
      stage.off('mousemove.plants');
    };
  }, [stage, selectedPlantForPlanting]);

  return selectedPlantForPlanting ? (
    <Group x={pos.x} y={pos.y} opacity={0.7}>
      <Circle width={width} height={height} fill={COLOR_PRIMARY_400} />
      <PublicNextcloudKonvaImage
        shareToken="2arzyJZYj2oNnHX"
        path={`Icons/${selectedPlantForPlanting?.plant.unique_name}.png`}
        width={width * 0.9}
        height={height * 0.9}
        offset={{ x: (width * 0.9) / 2, y: (height * 0.9) / 2 }}
        showErrorMessage={true}
      />
    </Group>
  ) : (
    <Rect width={0} height={0} />
  );
}
