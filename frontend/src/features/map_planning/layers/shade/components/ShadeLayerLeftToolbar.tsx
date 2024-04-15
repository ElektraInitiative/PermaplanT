import React from 'react';
import {
  DeleteShadingAction,
  UpdateShadingAction,
  UpdateShadingAddDateAction,
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
    if (!selectedShadings?.length || isReadOnlyMode || !shade) return;

    executeAction(
      new UpdateShadingAction(
        selectedShadings
          // Prevent infinite loops caused by select menus being updated after this action is executed.
          .filter((s) => s.shade !== shade)
          .map((s) => {
            return { ...s, shade };
          }),
      ),
    );
  };

  const onAddDateChange = ({ addDate }: ShadingCoreDataAttribute) => {
    if (!selectedShadings?.length || isReadOnlyMode) return;

    executeAction(new UpdateShadingAddDateAction(selectedShadings.map((s) => ({ ...s, addDate }))));
  };

  const onRemoveDateChange = ({ removeDate }: ShadingCoreDataAttribute) => {
    if (!selectedShadings?.length || isReadOnlyMode) return;

    executeAction(
      new UpdateShadingAddDateAction(selectedShadings.map((s) => ({ ...s, removeDate }))),
    );
  };

  const onDeleteClick = () => {
    if (!selectedShadings?.length || isReadOnlyMode) return;

    executeAction(new DeleteShadingAction(selectedShadings));
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
