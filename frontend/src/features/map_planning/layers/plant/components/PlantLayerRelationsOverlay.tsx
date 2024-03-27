import { useEffect, useMemo, useState } from 'react';
import { Layer, Line } from 'react-konva';
import { LayerType, RelationType } from '@/api_types/definitions';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useRelations } from '../hooks/relationsHookApi';

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
  const selectedPlantings = useMapStore((s) => s.untrackedState.layers.plants.selectedPlantings);
  const selectedPlanting = selectedPlantings?.length === 1 ? selectedPlantings[0] : null;

  const plantId = selectedPlantForPlanting?.plant.id ?? selectedPlanting?.plantId ?? null;
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

  const { data: relations, isLoading: areRelationsLoading } = useRelations({
    mapId,
    plantId: plantId as number,
    enabled: Boolean(plantId),
  });

  const layers = stage?.children;

  const relatedVisiblePlantings = useMemo(() => {
    return layers
      ?.filter((l) => l.name() === LayerType.Plants)
      .flatMap((l) => l.children ?? [])
      .filter((s) => s.attrs.plantId && s.isClientRectOnScreen())
      .filter((s) => relations?.has(s.attrs.plantId));
  }, [relations, layers]);

  return (
    <Layer listening={false}>
      {!areRelationsLoading && lineEnd && relatedVisiblePlantings
        ? relatedVisiblePlantings.map((s) => {
            const relation = relations?.get(s.attrs.plantId)?.relation;
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
    </Layer>
  );
}
