import { useRelations } from '../hooks/useRelations';
import { LayerType, RelationType } from '@/bindings/definitions';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useEffect, useMemo, useState } from 'react';
import { Layer, Line } from 'react-konva';

const relationColors = {
  [RelationType.Antagonist]: '#f005',
  [RelationType.Companion]: '#0f05',
  [RelationType.Neutral]: '#5555',
};

export function PlantLayerRelationsOverlay() {
  const stage = useMapStore((s) => s.stageRef?.current);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | undefined>(undefined);

  useEffect(() => {
    stage?.on('mousemove.plants', () => {
      const pos = stage?.getRelativePointerPosition();
      setMousePos(pos);
    });

    return () => {
      stage?.off('mousemove.plants');
    };
  }, [stage]);

  const selectedPlantForPlanting = useMapStore(
    (s) => s.untrackedState.layers.plants.selectedPlantForPlanting,
  );
  const selectedPlanting = useMapStore((s) => s.untrackedState.layers.plants.selectedPlanting);
  const mapId = useMapStore((s) => s.untrackedState.mapId);

  const plantId = selectedPlantForPlanting?.id ?? selectedPlanting?.plantId ?? null;

  // TODO: invalidate cache when plantings change
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { data } = useRelations(mapId, plantId!, Boolean(plantId));

  const layers = stage?.children;

  const relatedVisiblePlantings = useMemo(() => {
    return layers
      ?.filter((l) => l.name() === LayerType.Plants)
      .flatMap((l) => l.children ?? [])
      .filter((s) => s.attrs.plantId && s.isClientRectOnScreen())
      .filter((s) => data?.has(s.attrs.plantId));
  }, [data, layers]);

  return (
    <Layer listening={false}>
      {mousePos && relatedVisiblePlantings
        ? relatedVisiblePlantings.map((s) => {
            return (
              <Line
                stroke={
                  relationColors[data?.get(s.attrs.plantId)?.relation ?? RelationType.Neutral]
                }
                strokeWidth={4}
                key={s.id()}
                points={[mousePos.x, mousePos.y, s.x(), s.y()]}
              />
            );
          })
        : null}
    </Layer>
  );
}
