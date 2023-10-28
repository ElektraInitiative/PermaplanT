import { useRelations } from '../hooks/useRelations';
import { LayerType, RelationType } from '@/api_types/definitions';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useEffect, useMemo, useState } from 'react';
import { Group, Line } from 'react-konva';

const relationColors = {
  [RelationType.Antagonist]: '#f005',
  [RelationType.Companion]: '#0f05',
};

export function PlantLayerRelationsOverlay() {
  const stage = useMapStore((s) => s.stageRef?.current);
  const [lineEnd, setLineEnd] = useState<{ x: number; y: number } | undefined>(undefined);

  const mapId = useMapStore((s) => s.untrackedState.mapId);
  const selectedPlantForPlanting = useMapStore(
    (s) => s.untrackedState.layers.plants.selectedPlantForPlanting,
  );
  const selectedPlanting = useMapStore((s) => s.untrackedState.layers.plants.selectedPlanting);

  const plantId = selectedPlantForPlanting?.id ?? selectedPlanting?.plantId ?? null;
  const plantingNode = useMemo(
    () => (selectedPlanting?.id ? stage?.findOne(`#${selectedPlanting?.id}`) : null),
    [selectedPlanting?.id, stage],
  );

  useEffect(() => {
    if (!plantingNode) return;

    setLineEnd(plantingNode.position());

    plantingNode.on('dragmove.plants', () => {
      setLineEnd(plantingNode.position());
    });

    return () => {
      plantingNode.off('dragmove.plants');
    };
  }, [plantingNode]);

  useEffect(() => {
    if (!stage || !selectedPlantForPlanting) return;

    stage.on('mousemove.plants', () => {
      setLineEnd(stage.getRelativePointerPosition());
    });

    return () => {
      stage.off('mousemove.plants');
    };
  }, [stage, selectedPlantForPlanting, selectedPlanting]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { data, isLoading } = useRelations(mapId, plantId!, Boolean(plantId));

  const layers = stage?.children;

  const relatedVisiblePlantings = useMemo(() => {
    return layers
      ?.filter((l) => l.name() === LayerType.Plants)
      .flatMap((l) => l.children ?? [])
      .filter((s) => s.attrs.plantId && s.isClientRectOnScreen())
      .filter((s) => data?.has(s.attrs.plantId));
  }, [data, layers]);

  return (
    <Group listening={false}>
      {!isLoading && lineEnd && relatedVisiblePlantings
        ? relatedVisiblePlantings.map((s) => {
            const relation = data?.get(s.attrs.plantId)?.relation;
            if (!relation || relation === RelationType.Neutral) return null;

            return (
              <Line
                stroke={relationColors[relation]}
                strokeWidth={4}
                key={s.id()}
                points={[lineEnd.x, lineEnd.y, s.x(), s.y()]}
              />
            );
          })
        : null}
    </Group>
  );
}
