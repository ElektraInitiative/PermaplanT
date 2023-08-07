import { getHeatMap } from '@/features/map_planning/layers/heatmap/api/getHeatMap';
import useMapStore from '@/features/map_planning/store/MapStore';
import { findMapById } from '@/features/maps/api/findMapById';
import { useImageFromBlob } from '@/features/nextcloud_integration/hooks/useImageFromBlob';
import { useQuery } from '@tanstack/react-query';
import Konva from 'konva';
import { Layer, Image } from 'react-konva';

type HeatMapLayerProps = Konva.LayerConfig;

/**
 * Represents an array of closed edge loops.
 */
export type Geometry = {
  rings: Array<Array<{ x: number; y: number }>>;
  srid: string;
};

/**
 * Contains additional geometry properties that need to be derived in the frontend.
 */
export type GeometryStats = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};

/**
 * Derive GeometryStats from a Geometry object.
 *
 * @param geometry The object for which GeometryStats should be generated.
 */
export function calculateGeometryStats(geometry: Geometry): GeometryStats {
  const firstEdgeRing = geometry.rings[0];
  let minX = firstEdgeRing[0].x;
  let maxX = firstEdgeRing[0].x;
  let minY = firstEdgeRing[0].y;
  let maxY = firstEdgeRing[0].y;

  for (const point of firstEdgeRing) {
    minX = Math.min(point.x, minX);
    maxX = Math.max(point.x, maxX);
    minY = Math.min(point.y, minY);
    maxY = Math.max(point.y, maxY);
  }

  const width = Math.abs(maxX - minX);
  const height = Math.abs(maxY - minY);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
  };
}

export function useHeatmap(
  mapId: number,
  plantLayerId: number,
  shadeLayerId: number,
  selectedPlantId: number | undefined,
) {
  // cacheTime and staleTime are zero to force an image reload if any parameter changes.
  // Caching is not worth it in this case because the heatmap is no longer up to date if the user modified the plant layer.
  const {
    isLoading,
    isError,
    data: heatmapData,
  } = useQuery({
    queryKey: ['heatmap', selectedPlantId],
    queryFn: () => getHeatMap(mapId, plantLayerId, shadeLayerId, selectedPlantId),
    cacheTime: 0,
    staleTime: 0,
    enabled: !!mapId && !!plantLayerId && !!shadeLayerId && !!selectedPlantId,
  });

  const image = useImageFromBlob({
    isLoading,
    isError,
    data: heatmapData?.data,
    fallbackImageSource: '',
  });

  return {
    isLoading,
    isError,
    image,
  };
}

export const HeatMapLayer = (props: HeatMapLayerProps) => {
  const { ...layerProps } = props;

  const mapId = useMapStore((state) => state.untrackedState.mapId);
  const plantLayerId = useMapStore((state) => state.trackedState.layers.plants.id);
  const shadeLayerId = useMapStore((state) => state.trackedState.layers.shade.id);
  const selectedPlantId = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantForPlanting?.id,
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
