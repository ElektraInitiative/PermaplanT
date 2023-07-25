import { getPlantings } from '../api/getPlantings';
import { Map } from '../components/Map';
import { useGetLayers } from '../hooks/useGetLayers';
import { useMapId } from '../hooks/useMapId';
import { getBaseLayerImage } from '../layers/base/api/getBaseLayer';
import useMapStore from '../store/MapStore';
import { handleRemoteAction } from '../store/RemoteActions';
import { steps } from '../utils/EditorTour';
import { LayerType, LayerDto } from '@/bindings/definitions';
import { createAPI } from '@/config/axios';
import { QUERY_KEYS } from '@/config/react_query';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { useQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShepherdTour } from 'react-shepherd';
import { toast } from 'react-toastify';

/**
 * Extracts the default layer from the list of layers.
 */
function getDefaultLayer(layers: LayerDto[], layerType: LayerType) {
  return layers.find((l) => l.type_ === layerType && !l.is_alternative);
}

/**
 * Parameters for the useLayer types of hooks.
 */
type UseLayerParams = {
  mapId: number;
  layerId: number;
  enabled?: boolean;
};

/**
 * Hook that initializes the plant layer by fetching all plantings
 * and adding them to the store.
 */
function usePlantLayer({ mapId, layerId }: UseLayerParams) {
  const fetchDate = useMapStore((state) => state.untrackedState.fetchDate);
  const { t } = useTranslation(['plantSearch']);

  const query = useQuery({
    queryKey: [QUERY_KEYS.PLANTINGS, mapId, { layerId, fetchDate }],
    queryFn: () => getPlantings(mapId, { layer_id: layerId, relative_to_date: fetchDate }),
    // We want to refetch manually.
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: 0,
    enabled: Boolean(layerId),
  });

  if (query.error) {
    console.error(query.error);
    toast.error(t('plantSearch:error_initializing_layer'), { autoClose: false });
  }

  const data = query.data;
  useEffect(() => {
    if (!data) return;

    useMapStore.getState().setTimelineBounds(data.from, data.to);
    useMapStore.getState().initPlantLayer(data.results);
  }, [mapId, data]);

  return query;
}

/**
 * Hook that initializes the base layer by fetching it and adding it to the store.
 */
function useBaseLayer({ mapId, layerId, enabled }: UseLayerParams) {
  const query = useQuery({
    queryKey: ['baselayer', mapId, layerId],
    queryFn: () => getBaseLayerImage(mapId, layerId),
    refetchOnWindowFocus: false,
    enabled,
  });

  useEffect(() => {
    if (!query?.data) return;

    useMapStore.getState().initBaseLayer(query.data);
  }, [mapId, layerId, query?.data]);

  return query;
}

/**
 * Hook that initializes the map by fetching all layers and layer elements.
 */
function useInitializeMap() {
  const mapId = useMapId();
  const { data: layers, error } = useGetLayers(mapId);
  const { t } = useTranslation(['layers']);

  if (error) {
    console.log(error);
    toast.error(t('layers:error_fetching_layers'), { autoClose: false });
  }

  useEffect(() => {
    if (!layers) return;

    const defaultLayers = layers.filter((l) => !l.is_alternative);
    for (const layer of defaultLayers) {
      useMapStore.getState().initLayerId(layer.type_, layer.id);
    }
  }, [layers]);

  const plantLayer = getDefaultLayer(layers ?? [], LayerType.Plants);
  const baseLayer = getDefaultLayer(layers ?? [], LayerType.Base);

  usePlantLayer({
    mapId,
    // The enabled flag prevents the query from being executed with an invalid layer id.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    layerId: plantLayer?.id!,
  });

  useBaseLayer({
    mapId,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    layerId: baseLayer?.id!,
    enabled: !!baseLayer?.id,
  });

  useEffect(() => {
    if (!baseLayer) return;

    useMapStore.setState((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        selectedLayer: baseLayer,
        mapId,
      },
    }));
  }, [mapId, baseLayer]);

  const isLoading = !layers;

  if (isLoading) {
    return null;
  }

  return { layers };
}

/**
 * A hook that runs once the map is unmounted to clean up the store.
 * This is done to prevent the store from being in an invalid state when
 * the user navigates to a different map.
 */
function useCleanMapStore() {
  useEffect(() => {
    return () => {
      useMapStore.getState().__resetStore();
    };
  }, []);
}

function useMapUpdates() {
  const mapId = useMapId();
  const { user } = useSafeAuth();
  const evRef = useRef<EventSource>();

  const userId = user?.profile.sub;

  useEffect(() => {
    if (!userId) {
      return;
    }

    const connectionQuery = {
      map_id: mapId,
      user_id: userId,
    };

    const http = createAPI();
    const uri = http.getUri({
      url: 'api/updates/maps',
      params: connectionQuery,
    });

    // TODO: implement authentication
    evRef.current = new EventSource(uri);
    evRef.current.onmessage = (ev) => handleRemoteAction(ev, userId);

    return () => {
      evRef.current?.close();
    };
  }, [userId, mapId]);
}

/**
 * Wrapper component that initializes the map and handles map updates.
 * This component is responsible for initializing the map and cleaning up
 * the store when the map is unmounted.
 */
export function MapWrapper() {
  useCleanMapStore();
  const mapData = useInitializeMap();
  useMapUpdates();

  if (!mapData) {
    return null;
  }

  const tourOptions = {
    defaultStepOptions: {
      cancelIcon: {
        enabled: true,
      },
    },
    useModalOverlay: true,
  };

  return (
    <ShepherdTour steps={steps} tourOptions={tourOptions}>
      <Map layers={mapData.layers} />
    </ShepherdTour>
  );
}
