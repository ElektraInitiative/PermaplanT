import { getPlantings } from '../api/getPlantings';
import { Map } from '../components/Map';
import { useGetLayers } from '../hooks/useGetLayers';
import { useMapId } from '../hooks/useMapId';
import useMapStore from '../store/MapStore';
import { handleRemoteAction } from '../store/RemoteActions';
import { LayerType, ConnectToMapQueryParams, LayerDto } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { useQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';
import { getBaseLayer } from '../layers/base/api/getBaseLayer';

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
  const query = useQuery({
    queryKey: ['plants/plantings', mapId, layerId],
    queryFn: () => getPlantings(mapId, layerId),
    enabled,
  });

  useEffect(() => {
    if (!query?.data) return;

    useMapStore.getState().initPlantLayer(query.data);
  }, [mapId, query?.data]);

  return query;
}

/**
 * Hook that initializes the base layer by fetching it and adding it to the store.
 */
function useBaseLayer({ mapId, layerId, enabled }: UseLayerParams) {
  const query = useQuery({
    queryKey: ['baselayer', mapId, layerId],
    queryFn: () => getBaseLayer(mapId, layerId),
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
  const { data: layers } = useGetLayers(mapId);

  const plantLayer = getDefaultLayer(layers ?? [], LayerType.Plants);
  const baseLayer = getDefaultLayer(layers ?? [], LayerType.Base);

  const { isLoading: arePlantingsLoading } = usePlantLayer({
    mapId,
    layerId: plantLayer?.id,
    enabled: !!plantLayer?.id,
  });

  const { isLoading: isBaseLayerLoading } = useBaseLayer({
    mapId,
    layerId: baseLayer?.id,
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

  const isLoading = !layers || arePlantingsLoading || isBaseLayerLoading;

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
  const { user } = useSafeAuth();
  const evRef = useRef<EventSource>();

  useEffect(() => {
    if (!user) {
      return;
    }

    const connectionQuery: ConnectToMapQueryParams = {
      map_id: 1,
      user_id: user.profile.sub,
    };

    const connectionParams = new URLSearchParams();
    connectionParams.append('map_id', `${connectionQuery.map_id}`);
    connectionParams.append('user_id', connectionQuery.user_id);

    // TODO: implement authentication
    evRef.current = new EventSource(
      `${baseApiUrl}/api/updates/maps?${connectionParams.toString()}`,
    );
    evRef.current.onmessage = (ev) => handleRemoteAction(ev, user);

    return () => {
      evRef.current?.close();
    };
  }, [user]);
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
