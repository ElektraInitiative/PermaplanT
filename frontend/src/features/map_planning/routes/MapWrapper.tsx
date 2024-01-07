import { EditorMap } from '../components/EditorMap';
import {
  useBaseLayer,
  useGetLayers,
  useInvalidateMapQueries,
  useMap,
  usePlantLayer,
} from '../hooks/mapEditorHookApi';
import { useTourStatus } from '../hooks/tourHookApi';
import { useMapId } from '../hooks/useMapId';
import useMapStore from '../store/MapStore';
import { handleRemoteAction } from '../store/RemoteActions';
import { mapEditorSteps, tourOptions } from '../utils/EditorTour';
import { ReadOnlyModeContextProvider } from '../utils/ReadOnlyModeContext';
import { LayerType, LayerDto } from '@/api_types/definitions';
import { createAPI } from '@/config/axios';
import { PolygonGeometry } from '@/features/map_planning/types/PolygonTypes';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { useRef, useEffect } from 'react';
import { ShepherdTour } from 'react-shepherd';

/**
 * Extracts the default layer from the list of layers.
 */
function getDefaultLayer(layerType: LayerType, layers?: LayerDto[]) {
  return layers?.find((l) => l.type_ === layerType && !l.is_alternative);
}

/**
 * Hook that initializes the map by fetching all map data, layers and layer elements.
 */
function useInitializeMap() {
  const mapId = useMapId();
  const { data: layers } = useGetLayers(mapId);
  const { data: map } = useMap(mapId);

  useEffect(() => {
    if (!layers) return;

    const defaultLayers = layers.filter((l) => !l.is_alternative);
    for (const layer of defaultLayers) {
      useMapStore.getState().initLayerId(layer.type_, layer.id);
    }
  }, [layers]);

  const plantLayer = getDefaultLayer(LayerType.Plants, layers);
  const baseLayer = getDefaultLayer(LayerType.Base, layers);

  // The casts are fine because we know that the queries only execute once they are enabled.
  usePlantLayer({
    mapId,
    layerId: plantLayer?.id as number,
    enabled: Boolean(plantLayer),
  });

  useBaseLayer({
    mapId,
    layerId: baseLayer?.id as number,
    enabled: Boolean(baseLayer),
  });

  // set the map id in the store
  useEffect(() => {
    useMapStore.setState((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        mapId,
      },
    }));
  }, [mapId]);

  // select plant layer per default
  useEffect(() => {
    if (!plantLayer) return;
    useMapStore.getState().updateSelectedLayer(plantLayer);
  }, [plantLayer]);

  // initialize the map geometry
  useEffect(() => {
    if (!map) return;

    useMapStore.setState((state) => ({
      ...state,
      trackedState: {
        ...state.trackedState,
        mapGeometry: map.geometry as PolygonGeometry,
      },
    }));
  }, [map]);

  const isLoading = !layers || !map;

  if (isLoading) {
    return null;
  }

  return layers;
}

/**
 * A hook that runs once the map is unmounted to clean up the store.
 * This is done to prevent the store from being in an invalid state when
 * the user navigates to a different map.
 */
function useCleanMapStore() {
  const invalidateMapQueries = useInvalidateMapQueries();

  useEffect(() => {
    return () => {
      useMapStore.getState().__resetStore();
      invalidateMapQueries();
    };
  }, [invalidateMapQueries]);
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

  const { data: tourStatus } = useTourStatus();

  if (!mapData || !tourStatus) {
    return null;
  }

  const steps = !tourStatus.editor_tour_completed ? mapEditorSteps : [];

  return (
    <ReadOnlyModeContextProvider>
      <ShepherdTour steps={steps} tourOptions={tourOptions}>
        <EditorMap layers={mapData} />
      </ShepherdTour>
    </ReadOnlyModeContextProvider>
  );
}
