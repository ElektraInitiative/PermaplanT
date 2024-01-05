import {
  MultipleShadingAttributeEditFrom,
  SingleShadingAttributeEditFrom,
} from '@/features/map_planning/layers/shade/components/ShadingAttributeEditForm';
import useMapStore from '@/features/map_planning/store/MapStore';
import React from 'react';

export function ShadeLayerLeftToolbar() {
  const selectedShadings = useMapStore(
    (state) => state.untrackedState.layers.shade.selectedShadings ?? [],
  );

  return (
    <>
      {selectedShadings.length == 1 && (
        <SingleShadingAttributeEditFrom shading={selectedShadings[0]} />
      )}
      {selectedShadings.length > 1 && (
        <MultipleShadingAttributeEditFrom shadings={selectedShadings} />
      )}
    </>
  );
}
