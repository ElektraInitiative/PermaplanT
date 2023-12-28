import { MultipleShadingsAttributeEditForm } from '@/features/map_planning/layers/shade/components/MultipleShadingsAttributeEditForm';
import { SingleShadingAttributeEditForm } from '@/features/map_planning/layers/shade/components/SingleShadingAttributeEditForm';
import useMapStore from '@/features/map_planning/store/MapStore';

export function ShadeLayerLeftToolbar() {
  const selectedShadings = useMapStore(
    (state) => state.untrackedState.layers.shade.selectedShadings ?? [],
  );

  return (
    <>
      {selectedShadings.length == 1 && (
        <SingleShadingAttributeEditForm shading={selectedShadings[0]} />
      )}
      {selectedShadings.length > 1 && <MultipleShadingsAttributeEditForm />}
    </>
  );
}
