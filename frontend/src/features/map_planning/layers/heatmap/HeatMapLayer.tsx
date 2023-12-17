import { useHeatmap } from '@/features/map_planning/layers/heatmap/hooks/useHeatmap';
import {
  calculateGeometryStats,
  Geometry,
} from '@/features/map_planning/layers/heatmap/util/geometry';
import useMapStore from '@/features/map_planning/store/MapStore';
import { findMapById } from '@/features/maps/api/findMapById';
import { useQuery } from '@tanstack/react-query';
import Konva from 'konva';
import { Layer, Image } from 'react-konva';

type HeatMapLayerProps = Konva.LayerConfig;

export const HeatMapLayer = (props: HeatMapLayerProps) => {
  const { ...layerProps } = props;

  const mapId = useMapStore((state) => state.untrackedState.mapId);
  const plantLayerId = useMapStore((state) => state.trackedState.layers.plants.id);
  const shadeLayerId = useMapStore((state) => state.trackedState.layers.shade.id);
  const selectedPlantId = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantForPlanting?.plant.id,
  );

  const {
    isLoading: mapIsLoading,
    isError: mapIsError,
    data: mapData,
  } = useQuery({
    queryKey: ['map', mapId],
    queryFn: () => findMapById(mapId),
    cacheTime: Infinity,
    enabled: !!mapId,
  });

  const {
    isLoading: heatmapIsLoading,
    isError: heatmapIsError,
    image,
  } = useHeatmap(mapId, plantLayerId, shadeLayerId, selectedPlantId);

  if (
    selectedPlantId === undefined ||
    heatmapIsLoading ||
    heatmapIsError ||
    mapIsLoading ||
    mapIsError ||
    mapData === undefined
  ) {
    return <Layer listening={false} />;
  }

  const geometryStats = calculateGeometryStats(mapData.geometry as Geometry);

  return (
    <Layer {...layerProps} listening={false}>
      <Image
        image={image}
        x={geometryStats.minX}
        y={geometryStats.minY}
        width={geometryStats.width}
        height={geometryStats.height}
      ></Image>
    </Layer>
  );
};
