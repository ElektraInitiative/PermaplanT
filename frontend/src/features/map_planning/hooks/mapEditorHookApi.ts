import { QueryFunctionContext, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getDrawings } from '../api/drawingApi';
import { getLayers } from '../api/getLayers';
import { getMap } from '../api/getMap';
import { getTimelineEvents } from '../api/getTimelineEvents';
import { getPlantings } from '../api/plantingApi';
import { getBaseLayerImage } from '../layers/base/api/getBaseLayer';
import useMapStore from '../store/MapStore';

const MAP_EDITOR_KEYS = {
  _helpers: {
    all: [{ entity: 'map_editor' }] as const,
    map: () => [{ ...MAP_EDITOR_KEYS._helpers.all[0], scope: 'map' }] as const,
    layers: () => [{ ...MAP_EDITOR_KEYS._helpers.all[0], scope: 'layers' }] as const,
    plant: () => [{ ...MAP_EDITOR_KEYS._helpers.all[0], scope: 'plant_layer' }] as const,
    base: () => [{ ...MAP_EDITOR_KEYS._helpers.all[0], scope: 'base_layer' }] as const,
    timeline: () => [{ ...MAP_EDITOR_KEYS._helpers.all[0], scope: 'timeline' }] as const,
    drawing: () => [{ ...MAP_EDITOR_KEYS._helpers.all[0], scope: 'drawing_layer' }] as const,
  },
  layers: (mapId: number) => [{ ...MAP_EDITOR_KEYS._helpers.layers()[0], mapId }] as const,
  map: (mapId: number) => [{ ...MAP_EDITOR_KEYS._helpers.map()[0], mapId }] as const,
  plantLayer: (mapId: number, layerId: number, fetchDate: string) =>
    [{ ...MAP_EDITOR_KEYS._helpers.plant()[0], mapId, layerId, fetchDate }] as const,
  baseLayer: (mapId: number, layerId: number) =>
    [{ ...MAP_EDITOR_KEYS._helpers.base()[0], mapId, layerId }] as const,
  drawingLayer: (mapId: number, layerId: number, fetchDate: string) =>
    [{ ...MAP_EDITOR_KEYS._helpers.drawing()[0], mapId, layerId, fetchDate }] as const,
  timeline: (mapId: number, startDate: string, endDate: string) =>
    [{ ...MAP_EDITOR_KEYS._helpers.timeline()[0], mapId, startDate, endDate }] as const,
};

const TEN_MINUTES = 1000 * 60 * 10;

/**
 * Fetch timeline events for the given map id.
 */
export function useGetTimelineEvents(mapId: number, startDate: string, endDate: string) {
  const queryInfo = useQuery({
    queryKey: MAP_EDITOR_KEYS.timeline(mapId, startDate, endDate),
    queryFn: getTimelineEventsQueryFn,
    refetchOnWindowFocus: false,
    staleTime: TEN_MINUTES,
  });

  return queryInfo.data;
}

function getTimelineEventsQueryFn({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof MAP_EDITOR_KEYS)['timeline']>>) {
  const { mapId, startDate, endDate } = queryKey[0];
  return getTimelineEvents(mapId, startDate, endDate);
}

/**
 * Gets all layers for the given map id.
 * Re-fetches data only after a certain amount of time to reduce network stress.
 */
export function useGetLayers(mapId: number) {
  const { t } = useTranslation(['layers']);

  return useQuery({
    queryKey: MAP_EDITOR_KEYS.layers(mapId),
    queryFn: getLayersQueryFn,
    // after this time, the query is considered stale and will be re-fetched on next access
    staleTime: TEN_MINUTES,
    refetchOnWindowFocus: false,
    meta: {
      errorMessage: t('layers:error_fetching_layers'),
    },
  });
}

function getLayersQueryFn({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof MAP_EDITOR_KEYS)['layers']>>) {
  const { mapId } = queryKey[0];

  return getLayers(mapId);
}

/**
 * Get map data for the given map id.
 */
export function useMap(mapId: number) {
  const { t } = useTranslation(['maps']);

  return useQuery({
    queryKey: MAP_EDITOR_KEYS.map(mapId),
    queryFn: getMapQueryFn,
    refetchOnWindowFocus: false,
    meta: {
      errorMessage: t('maps:error_fetch_map_data'),
    },
  });
}

function getMapQueryFn({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof MAP_EDITOR_KEYS)['map']>>) {
  const { mapId } = queryKey[0];

  return getMap(mapId);
}

/**
 * Arguments for the useLayer types of hooks.
 */
type UseLayerArgs = {
  mapId: number;
  layerId: number;
  enabled?: boolean;
};

/**
 * Hook that initializes the drawing layer by fetching all drawings
 */
export function useDrawingLayer({ mapId, layerId, enabled }: UseLayerArgs) {
  const fetchDate = useMapStore((state) => state.untrackedState.fetchDate);
  const { t } = useTranslation(['plantSearch']);

  const queryInfo = useQuery({
    queryKey: MAP_EDITOR_KEYS.drawingLayer(mapId, layerId, fetchDate),
    queryFn: drawingLayerQueryFn,
    // We want to refetch manually.
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: 0,
    enabled,
    meta: {
      errorMessage: t('plantSearch:error_initializing_layer'),
    },
  });

  const { data: drawingInfo } = queryInfo;

  useEffect(() => {
    if (!drawingInfo) return;
    useMapStore.getState().initDrawingLayer(drawingInfo);
  }, [mapId, drawingInfo]);

  return queryInfo;
}

function drawingLayerQueryFn({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof MAP_EDITOR_KEYS)['drawingLayer']>>) {
  const { mapId, layerId, fetchDate } = queryKey[0];
  return getDrawings(mapId, { layer_id: layerId, relative_to_date: fetchDate });
}

/**
 * Hook that initializes the plant layer by fetching all plantings
 * and adding them to the store.
 */
export function usePlantLayer({ mapId, layerId, enabled }: UseLayerArgs) {
  const fetchDate = useMapStore((state) => state.untrackedState.fetchDate);
  const { t } = useTranslation(['plantSearch']);

  const queryInfo = useQuery({
    queryKey: MAP_EDITOR_KEYS.plantLayer(mapId, layerId, fetchDate),
    queryFn: plantLayerQueryFn,
    // We want to refetch manually.
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: 0,
    enabled,
    meta: {
      errorMessage: t('plantSearch:error_initializing_layer'),
    },
  });
  const { data: plantingInfo } = queryInfo;

  useEffect(() => {
    if (!plantingInfo) return;

    useMapStore.getState().setTimelineBounds(plantingInfo.from, plantingInfo.to);
    useMapStore.getState().initPlantLayer(plantingInfo.results);
  }, [mapId, plantingInfo]);

  return queryInfo;
}

function plantLayerQueryFn({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof MAP_EDITOR_KEYS)['plantLayer']>>) {
  const { mapId, layerId, fetchDate } = queryKey[0];

  return getPlantings(mapId, { layer_id: layerId, relative_to_date: fetchDate });
}

/**
 * Hook that initializes the base layer by fetching it and adding it to the store.
 */
export function useBaseLayer({ mapId, layerId, enabled }: UseLayerArgs) {
  const queryInfo = useQuery({
    queryKey: MAP_EDITOR_KEYS.baseLayer(mapId, layerId),
    queryFn: baseLayerQueryFn,
    // We want to refetch manually.
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: 0,
    enabled,
  });

  useEffect(() => {
    if (!queryInfo?.data) return;

    useMapStore.getState().initBaseLayer(queryInfo.data);
  }, [mapId, layerId, queryInfo?.data]);

  return queryInfo;
}

function baseLayerQueryFn({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof MAP_EDITOR_KEYS)['baseLayer']>>) {
  const { mapId, layerId } = queryKey[0];

  return getBaseLayerImage(mapId, layerId);
}

export function useInvalidateMapQueries() {
  const queryClient = useQueryClient();

  return useCallback(
    () => queryClient.invalidateQueries(MAP_EDITOR_KEYS._helpers.all),
    [queryClient],
  );
}
