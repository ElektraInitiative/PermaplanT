import { createAPI } from '@/config/axios';

/**
 * Tells the backend to generate a heatmap.
 *
 * @param mapId The map for which the heatmap is generated.
 * @param plantLayerId Which plant layer should be considered?
 * @param shadeLayerId Which shade layer should be used?
 * @param plantId The plant that is supposed to be added to the plant layer.
 */
export async function getHeatMap(
  mapId: number,
  plantLayerId: number,
  shadeLayerId: number,
  plantId: number | undefined,
) {
  if (plantId === undefined) {
    return null;
  }

  const http = createAPI();

  try {
    return await http.get(`api/maps/${mapId}/layers/plants/heatmap`, {
      params: { plant_layer_id: plantLayerId, plant_id: plantId, shade_layer_id: shadeLayerId },
      responseType: 'blob',
      timeout: Infinity,
    });
  } catch (error) {
    throw error as Error;
  }
}
