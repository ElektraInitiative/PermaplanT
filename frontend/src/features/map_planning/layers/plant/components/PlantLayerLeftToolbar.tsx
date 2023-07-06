import { DeletePlantAction } from '../actions';
import { useFindPlantById } from '../hooks/useFindPlantById';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useTranslation } from 'react-i18next';

export function PlantLayerLeftToolbar() {
  const selectedPlanting = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlanting,
  );
  const executeAction = useMapStore((state) => state.executeAction);
  const selectPlanting = useMapStore((state) => state.selectPlanting);
  const transformerRef = useMapStore((state) => state.transformer);
  const { t } = useTranslation(['plantEdit']);

  const { plant } = useFindPlantById(selectedPlanting?.plantId ?? NaN, Boolean(selectedPlanting));

  return selectedPlanting ? (
    <div className="flex flex-col gap-2 p-2">
      <h2>{plant?.unique_name}</h2>
      <SimpleFormInput
        id="input1"
        labelText="Some attribute"
        placeholder="some input"
      ></SimpleFormInput>
      <SimpleFormInput
        id="input1"
        labelText="Some attribute"
        placeholder="some input"
      ></SimpleFormInput>

      <SimpleButton
        variant={ButtonVariant.dangerBase}
        onClick={() => {
          executeAction(new DeletePlantAction(selectedPlanting.id));
          selectPlanting(null);
          transformerRef.current?.nodes([]);
        }}
      >
        {t('plantEdit:delete')}
      </SimpleButton>
    </div>
  ) : null;
}
