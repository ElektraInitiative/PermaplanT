import { getHeatMap } from '@/features/map_planning/layers/heatmap/api/getHeatMap';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useImageFromBlob } from '@/features/nextcloud_integration/hooks/useImageFromBlob';
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
    (state) => state.untrackedState.layers.plants.selectedPlantForPlanting?.id,
  );

  const { isLoading, isError, data } = useQuery({
    queryKey: ['heatmap', selectedPlantId],
    queryFn: () => getHeatMap(mapId, plantLayerId, shadeLayerId, selectedPlantId),
    cacheTime: 0,
    staleTime: 0,
    enabled: !!mapId && !!plantLayerId && !!shadeLayerId && !!selectedPlantId,
  });

  const image = useImageFromBlob({
    isLoading,
    isError,
    data: data?.data,
    fallbackImageSource: '',
  });

  if (selectedPlantId === undefined || data === undefined || isLoading || isError) {
    return <Layer listening={false} />;
  }

  return (
    <Layer {...layerProps} listening={false}>
      <Image image={image} x={0} y={0} strokeWidth={1}></Image>
    </Layer>
  );
};
