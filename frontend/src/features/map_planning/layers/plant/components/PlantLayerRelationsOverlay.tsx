import Konva from 'konva';
import { useEffect, useMemo, useState } from 'react';
import { Group, Line } from 'react-konva';
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
  const selectedPlanting = selectedPlantings?.[0] ?? null;

  const plantId = selectedPlantForPlanting?.plant.id ?? selectedPlanting?.plantId ?? null;
  const plantingNode = useMemo(
    () => (selectedPlanting?.id ? stage?.findOne(`#${selectedPlanting?.id}`) : null),
    [selectedPlanting?.id, stage],
  );

  useEffect(() => {
    if (!plantingNode) return;

    setLineEnd(getPosition(plantingNode));

    plantingNode.on('dragmove.plants', () => {
      setLineEnd(getPosition(plantingNode));
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

  const visiblePlantingNodes = useMemo(() => {
    return (
      layers
        ?.flatMap((l) => l.children ?? [])
        .filter((l) => l.name() === LayerType.Plants)
        // @ts-expect-error Typescript can't tell that all direct children layer must have children themselves
        .filter((group) => group['children'] !== undefined)
        // @ts-expect-error Typescript can't tell that all direct children layer must have children themselves
        .flatMap((group) => group?.children)
        .filter((s) => s.attrs.plantId && s.isClientRectOnScreen())
        .filter((s) => relations?.has(s.attrs.plantId))
    );
  }, [relations, layers]);

  return (
    <Group listening={false}>
      {!areRelationsLoading && lineEnd && visiblePlantingNodes
        ? visiblePlantingNodes.map((node) => {
            const relation = relations?.get(node.attrs.plantId)?.relation;
            if (!relation || relation === RelationType.Neutral) return null;

            const { x, y } = getPosition(node);

            return (
              <Line
                stroke={relationColors[relation]}
                strokeWidth={4}
                key={node.id()}
                points={[lineEnd.x, lineEnd.y, x, y]}
              />
            );
          })
        : null}
    </Group>
  );
}

function getPosition(node: Konva.Node) {
  const isArea = Boolean(node.attrs.isArea);
  const x = isArea ? node.x() + node.width() / 2 : node.x();
  const y = isArea ? node.y() + node.height() / 2 : node.y();
  return { x, y };
}
