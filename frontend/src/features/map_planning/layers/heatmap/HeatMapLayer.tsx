import { getHeatMap } from '@/features/map_planning/layers/heatmap/api/getHeatMap';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useImageFromBlob } from '@/features/nextcloud_integration/hooks/useImageFromBlob';
import { AxiosResponse } from 'axios';
import Konva from 'konva';
import { useEffect, useState } from 'react';
import { Layer, Image } from 'react-konva';

type HeatMapLayerProps = Konva.LayerConfig;

export const HeatMapLayer = (props: HeatMapLayerProps) => {
  const { ...layerProps } = props;

  const mapId = useMapStore((state) => state.untrackedState.mapId);
  const layerId = useMapStore((state) => state.trackedState.layers.plants.id);
  const selectedPlantId = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantForPlanting?.id,
  );

  const [imageResponse, setImageResponse] = useState<AxiosResponse | null>();

  useEffect(() => {
    async function loadHeatmapImage() {
      const response = await getHeatMap(mapId, layerId, selectedPlantId);
      setImageResponse(response);
    }

    if (!imageResponse) {
      loadHeatmapImage();
    }
  });

  const image = useImageFromBlob({
    isLoading: false,
    isError: imageResponse === null || imageResponse?.status !== 200,
    data: imageResponse?.data,
    fallbackImageSource: '',
  });

  return (
    <Layer {...layerProps} listening={false}>
      <Image image={image}></Image>
    </Layer>
  );
};
