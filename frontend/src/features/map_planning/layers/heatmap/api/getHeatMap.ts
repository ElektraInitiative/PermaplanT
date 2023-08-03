import { createAPI } from '@/config/axios';

/**
 * Tells the backend to generate a heatmap.
 *
 * @param mapId The map for which the heatmap is generated.
 * @param layerId Which plant layer should be considered.
 * @param plantId The plant that is supposed to be added to the plant layer.
 */
export async function getHeatMap(mapId: number, layerId: number, plantId: number | undefined) {
  if (!plantId) {
    return null;
  }

  const http = createAPI();

  try {
    return await http.get(`api/maps/${mapId}/layers/plants/heatmap`, {
      params: { layer_id: layerId, plant_id: plantId },
    });
  } catch (error) {
    throw error as Error;
  }
}
