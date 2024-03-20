import React from 'react';
import {
  DeleteShadingAction,
  UpdateShadingAction,
  UpdateShadingAddDateAction,
  UpdateShadingRemoveDateAction,
} from '@/features/map_planning/layers/shade/actions';
import {
  MultipleShadingAttributeEditFrom,
  SingleShadingAttributeEditFrom,
} from '@/features/map_planning/layers/shade/components/ShadingAttributeEditForm';
import { ShadingCoreDataAttribute } from '@/features/map_planning/layers/shade/components/ShadingAttributeEditForm';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useIsReadOnlyMode } from '@/features/map_planning/utils/ReadOnlyModeContext';

export function ShadeLayerLeftToolbar() {
  const selectedShadings = useMapStore(
    (state) => state.untrackedState.layers.shade.selectedShadings ?? [],
  );
  const executeAction = useMapStore((state) => state.executeAction);
  const step = useMapStore((state) => state.step);

  const isReadOnlyMode = useIsReadOnlyMode();

  const nothingSelected = !selectedShadings?.length;

  const onShadeChange = ({ shade }: ShadingCoreDataAttribute) => {
    if (!selectedShadings?.length || isReadOnlyMode) return;

    selectedShadings.forEach((selectedShading) => {
      // This prevents an infinite loop because the corresponding select menu triggers an
      // update after its received its initial value.
      if (selectedShading.shade === shade || shade === undefined) return;

      executeAction(
        new UpdateShadingAction({
          id: selectedShading.id,
          shade: shade,
          geometry: selectedShading.geometry,
        }),
      );
    });
  };

  const onAddDateChange = ({ addDate }: ShadingCoreDataAttribute) => {
    if (!selectedShadings?.length || isReadOnlyMode) return;

    selectedShadings.forEach((selectedShading) =>
      executeAction(new UpdateShadingAddDateAction({ id: selectedShading.id, addDate })),
    );
  };

  const onRemoveDateChange = ({ removeDate }: ShadingCoreDataAttribute) => {
    if (!selectedShadings?.length || isReadOnlyMode) return;

    selectedShadings.forEach((selectedShading) =>
      executeAction(new UpdateShadingRemoveDateAction({ id: selectedShading.id, removeDate })),
    );
  };

  const onDeleteClick = () => {
    if (!selectedShadings?.length || isReadOnlyMode) return;

    selectedShadings.forEach((selectedShading) =>
      executeAction(new DeleteShadingAction({ id: selectedShading.id })),
    );
  };

  if (nothingSelected) {
    return null;
  }

  return (
    <>
      {selectedShadings.length == 1 && (
        <SingleShadingAttributeEditFrom
          shading={selectedShadings[0]}
          // remount the form when the selected shading or the step changes (on undo/redo)
          key={`${selectedShadings[0].id}-${step}`}
          onShadeChange={onShadeChange}
          onAddDateChange={onAddDateChange}
          onRemoveDateChange={onRemoveDateChange}
          onDeleteShading={onDeleteClick}
        />
      )}
      {selectedShadings.length > 1 && (
        <MultipleShadingAttributeEditFrom
          shadings={selectedShadings}
          key={
            selectedShadings.reduce(
              (key, selectedPlanting) => key + selectedPlanting.id + '-',
              '',
            ) + `${step}`
          }
          onShadeChange={onShadeChange}
          onAddDateChange={onAddDateChange}
          onRemoveDateChange={onRemoveDateChange}
          onDeleteShading={onDeleteClick}
        />
      )}
    </>
  );
}
