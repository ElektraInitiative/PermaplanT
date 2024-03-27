import { useQuery } from '@tanstack/react-query';
import { getHeatMap } from '@/features/map_planning/layers/heatmap/api/getHeatMap';
import { useImageFromBlob } from '@/features/nextcloud_integration/hooks/useImageFromBlob';

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
