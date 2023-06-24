import { getPlantings } from '../api/getPlantings';
import { Map } from '../components/Map';
import { useGetLayers } from '../hooks/useGetLayers';
import { useMapId } from '../hooks/useMapId';
import useMapStore from '../store/MapStore';
import { handleRemoteAction } from '../store/RemoteActions';
import { LayerType, LayerDto } from '@/bindings/definitions';
import { createAPI } from '@/config/axios';
import { QUERY_KEYS } from '@/config/react_query';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { useQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  layerId: number | undefined;
  enabled: boolean;
};

/**
 * Hook that initializes the plant layer by fetching all plantings
 * and adding them to the store.
 */
function usePlantLayer({ mapId, layerId, enabled }: UseLayerParams) {
  const { t } = useTranslation(['plantSearch']);
  const relativeToDate = new Date().toJSON().split('T')[0];

  const query = useQuery({
    queryKey: [QUERY_KEYS.PLANTINGS, mapId, { layerId, relativeToDate }],
    queryFn: () => getPlantings(mapId, { layer_id: layerId, relative_to_date: relativeToDate }),
    enabled,
  });

  if (query.error) {
    console.error(query.error);
    toast.error(t('plantSearch:error_initializing_layer'), { autoClose: false });
  }

  useEffect(() => {
    if (!query?.data) return;

    useMapStore.getState().initPlantLayer(query.data);
  }, [mapId, query?.data]);

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

  const plantLayer = getDefaultLayer(layers ?? [], LayerType.Plants);
  const baseLayer = getDefaultLayer(layers ?? [], LayerType.Base);

  const { isLoading: arePlantingsLoading } = usePlantLayer({
    mapId,
    layerId: plantLayer?.id,
    enabled: !!plantLayer?.id,
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

  const isLoading = !layers || arePlantingsLoading;

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

  useEffect(() => {
    if (!user) {
      return;
    }

    const connectionQuery = {
      map_id: mapId,
      user_id: user.profile.sub,
    };

    const http = createAPI();
    const uri = http.getUri({
      url: 'api/updates/maps',
      params: connectionQuery,
    });

    // TODO: implement authentication
    evRef.current = new EventSource(uri);
    evRef.current.onmessage = (ev) => handleRemoteAction(ev, user);

    return () => {
      evRef.current?.close();
    };
  }, [user, mapId]);
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

  return <Map layers={mapData.layers} />;
}
