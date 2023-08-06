import { getHeatMap } from '@/features/map_planning/layers/heatmap/api/getHeatMap';
import useMapStore from '@/features/map_planning/store/MapStore';
import { findMapById } from '@/features/maps/api/findMapById';
import { useImageFromBlob } from '@/features/nextcloud_integration/hooks/useImageFromBlob';
import { useQuery } from '@tanstack/react-query';
import Konva from 'konva';
import { Layer, Image } from 'react-konva';

type HeatMapLayerProps = Konva.LayerConfig;

type Geomerty = {
  rings: Array<Array<{ x: number; y: number }>>;
  srid: string;
};

export const HeatMapLayer = (props: HeatMapLayerProps) => {
  const { ...layerProps } = props;

  const mapId = useMapStore((state) => state.untrackedState.mapId);
  const plantLayerId = useMapStore((state) => state.trackedState.layers.plants.id);
  const shadeLayerId = useMapStore((state) => state.trackedState.layers.shade.id);
  const selectedPlantId = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantForPlanting?.id,
  );

  const {
    isLoading: heatmapIsLoading,
    isError: heatmapIsError,
    data: heatmapData,
  } = useQuery({
    queryKey: ['heatmap', selectedPlantId],
    queryFn: () => getHeatMap(mapId, plantLayerId, shadeLayerId, selectedPlantId),
    cacheTime: 0,
    staleTime: 0,
    enabled: !!mapId && !!plantLayerId && !!shadeLayerId && !!selectedPlantId,
  });

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

  const image = useImageFromBlob({
    isLoading: heatmapIsLoading,
    isError: heatmapIsError,
    data: heatmapData?.data,
    fallbackImageSource: '',
  });

  if (
    selectedPlantId === undefined ||
    heatmapData === undefined ||
    heatmapIsLoading ||
    heatmapIsError ||
    mapIsLoading ||
    mapIsError ||
    mapData === undefined
  ) {
    return <Layer listening={false} />;
  }

  // calculate map bounds
  // we only need the first edge ring
  const geometry = (mapData.geometry as Geomerty).rings[0];
  let minX = geometry[0].x;
  let maxX = geometry[0].x;
  let minY = geometry[0].y;
  let maxY = geometry[0].y;

  for (const point of geometry) {
    minX = Math.min(point.x, minX);
    maxX = Math.max(point.x, maxX);
    minY = Math.min(point.y, minY);
    maxY = Math.max(point.y, maxY);
  }

  const width = Math.abs(maxX - minX);
  const height = Math.abs(maxY - minY);

  return (
    <Layer {...layerProps} listening={false}>
      <Image
        image={image}
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        strokeWidth={1}
      ></Image>
    </Layer>
  );
};
