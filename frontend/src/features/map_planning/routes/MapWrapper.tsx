import { getPlantings } from '../api/getPlantings';
import { Map } from '../components/Map';
import { useDefaultLayer } from '../hooks/useDefaultLayer';
import { useGetLayers } from '../hooks/useGetLayers';
import { useMapId } from '../hooks/useMapId';
import useMapStore from '../store/MapStore';
import { handleRemoteAction } from '../store/RemoteActions';
import { LayerType, ConnectToMapQueryParams } from '@/bindings/definitions';
import { baseApiUrl } from '@/config';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { useQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';

function useInitializeMap() {
  useMapUpdates();
  const initPlantLayer = useMapStore((state) => state.initPlantLayer);
  const mapId = useMapId();
  const { data: layers } = useGetLayers(mapId);

  const plantLayer = useDefaultLayer(mapId, LayerType.Plants);
  const baseLayer = useDefaultLayer(mapId, LayerType.Base);

  const { isLoading: arePlantingsLoading } = useQuery(
    ['plants/plantings', mapId, plantLayer?.id] as const,
    {
      queryFn: ({ queryKey: [, mapId, plantLayerId] }) => getPlantings(mapId, plantLayerId),
      onSuccess: (data) => {
        if (!baseLayer) return;

        useMapStore.setState((state) => ({
          ...state,
          untrackedState: {
            ...state.untrackedState,
            selectedLayer: baseLayer,
            mapId,
          },
        }));

        initPlantLayer(data);
      },
    },
  );

  const isLoading = !layers || arePlantingsLoading;

  if (isLoading) {
    return null;
  }

  return { layers };
}

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
    if (user) {
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
    }

    return () => {
      evRef.current?.close();
    };
  }, [user]);
}

export function MapWrapper() {
  useCleanMapStore();
  const mapData = useInitializeMap();

  if (!mapData) {
    return null;
  }

  return <Map layers={mapData.layers} />;
}
