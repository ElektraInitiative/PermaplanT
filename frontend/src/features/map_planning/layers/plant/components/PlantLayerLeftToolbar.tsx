import { DeletePlantAction } from '../actions';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import useMapStore from '@/features/map_planning/store/MapStore';
import { findPlantById } from '@/features/seeds/api/findPlantById';
import { useQuery } from '@tanstack/react-query';

export function PlantLayerLeftToolbar() {
  const selectedPlanting = useMapStore(
    (state) => state.untrackedState.layers.Plant.selectedPlanting,
  );
  const executeAction = useMapStore((state) => state.executeAction);
  const selectPlanting = useMapStore((state) => state.selectPlanting);
  const transformerRef = useMapStore((state) => state.transformer);

  const { data: plant } = useQuery(['plants/plant', selectedPlanting?.plantId ?? NaN] as const, {
    queryFn: (context) => findPlantById(context.queryKey[1]),
    enabled: Boolean(selectedPlanting),
    staleTime: Infinity,
  });

  return selectedPlanting ? (
    <div className="flex flex-col gap-2 p-2">
      <h2>Edit attributes {plant?.unique_name}</h2>
      <SimpleFormInput
        id="input1"
        labelText="Some attribute"
        placeHolder="some input"
      ></SimpleFormInput>
      <SimpleFormInput
        id="input1"
        labelText="Some attribute"
        placeHolder="some input"
      ></SimpleFormInput>

      <SimpleButton>Submit Changes</SimpleButton>

      <SimpleButton
        variant={ButtonVariant.dangerBase}
        onClick={() => {
          executeAction(new DeletePlantAction(selectedPlanting.id));
          selectPlanting(null);
          transformerRef.current?.nodes([]);
        }}
      >
        Delete Planting
      </SimpleButton>
    </div>
  ) : null;
}
