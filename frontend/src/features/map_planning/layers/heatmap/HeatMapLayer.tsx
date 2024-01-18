import Konva from 'konva';
import { Layer, Image } from 'react-konva';
import { useHeatmap } from '@/features/map_planning/layers/heatmap/hooks/useHeatmap';
import {
  calculateGeometryStats,
  Geometry,
} from '@/features/map_planning/layers/heatmap/util/geometry';
import useMapStore from '@/features/map_planning/store/MapStore';

type HeatMapLayerProps = Konva.LayerConfig;

export const HeatMapLayer = (props: HeatMapLayerProps) => {
  const { ...layerProps } = props;

  const mapId = useMapStore((state) => state.untrackedState.mapId);
  const plantLayerId = useMapStore((state) => state.trackedState.layers.plants.id);
  const shadeLayerId = useMapStore((state) => state.trackedState.layers.shade.id);
  const selectedPlantId = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantForPlanting?.plant.id,
  );
  const mapGeometry = useMapStore((state) => state.trackedState.mapGeometry);

  const {
    isLoading: heatmapIsLoading,
    isError: heatmapIsError,
    image,
  } = useHeatmap(mapId, plantLayerId, shadeLayerId, selectedPlantId);

  if (selectedPlantId === undefined || heatmapIsLoading || heatmapIsError) {
    return <Layer listening={false} />;
  }

  const geometryStats = calculateGeometryStats(mapGeometry as Geometry);

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
