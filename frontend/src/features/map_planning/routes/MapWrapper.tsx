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
  layerId: number;
  enabled: boolean;
};

/**
 * Hook that initializes the plant layer by fetching all plantings
 * and adding them to the store.
 */
function usePlantLayer({ mapId, layerId, enabled }: UseLayerParams) {
  const { t } = useTranslation(['plantSearch']);

  // Do not use the store value `timelineDate` here.
  // We want to manually fetch the plantings for the current date.
  const timelineDate = useMapStore((state) => state.untrackedState.timelineDate);

  const query = useQuery({
    queryKey: [QUERY_KEYS.PLANTINGS, mapId, { layerId, timelineDate }],
    queryFn: () => getPlantings(mapId, { layer_id: layerId, relative_to_date: timelineDate }),
    enabled,
  });

  if (query.error) {
    console.error(query.error);
    toast.error(t('plantSearch:error_initializing_layer'), { autoClose: false });
  }

  useEffect(() => {
    if (!query?.data) return;

    useMapStore.getState().setTimelineBounds(query.data.from, query.data.to);
    useMapStore.getState().initPlantLayer(query.data.results);
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

  useEffect(() => {
    if (!layers) return;

    const defaultLayers = layers.filter((l) => !l.is_alternative);
    for (const layer of defaultLayers) {
      useMapStore.getState().initLayerId(layer.type_, layer.id);
    }
  }, [layers]);

  const plantLayer = getDefaultLayer(layers ?? [], LayerType.Plants);
  const baseLayer = getDefaultLayer(layers ?? [], LayerType.Base);

  const { isLoading: arePlantingsLoading } = usePlantLayer({
    mapId,
    // The enabled flag prevents the query from being executed with an invalid layer id.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    layerId: plantLayer?.id!,
    enabled: Boolean(plantLayer),
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

  return <Map layers={mapData.layers} />;
}
