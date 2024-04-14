/* TODO: these imports should be added again when the corresponding functionality of the buttons is implemented */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayerDto, LayerType } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import ModalContainer from '@/components/Modals/ModalContainer';
import TransparentBackground from '@/components/TransparentBackground';
import AddIcon from '@/svg/icons/add.svg?react';
import RemoveIcon from '@/svg/icons/trash.svg?react';
import { deleteDrawing } from '../../api/drawingApi';
import { useCreateLayer, useDeleteLayer } from '../../hooks/mapEditorHookApi';
import { useMapId } from '../../hooks/useMapId';
import useMapStore from '../../store/MapStore';
import { LayerListItem } from './LayerListItem';

export type LayerListProps = {
  layers: LayerDto[];
};

/** Layer controls including visibility, layer selection, opacity and alternatives */
export const LayerList = ({ layers }: LayerListProps) => {
  const updateSelectedLayer = useMapStore((map) => map.updateSelectedLayer);
  const selectedLayer = useMapStore((map) => map.untrackedState.selectedLayer) as LayerDto;

  const updateLayerOpacity = useMapStore((map) => map.updateLayerOpacity);
  const { t } = useTranslation(['layers', 'layerSettings', 'common']);

  const [newLayerName, setNewLayerName] = React.useState('');
  const [showNameModal, setShowNameModal] = React.useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = React.useState(false);

  const mapId = useMapId();

  const deleteLayerSuccessCallback = () => {
    const selectedLayerIndex = layers.findIndex((l) => l.id === selectedLayer.id);
    updateSelectedLayer(selectedLayerIndex > 0 ? layers[selectedLayerIndex - 1] : layers[0]);
  };

  const { mutate: createLayer } = useCreateLayer(mapId, LayerType.Drawing, newLayerName);
  const { mutate: deleteLayer } = useDeleteLayer(
    mapId,
    selectedLayer?.id || 0,
    deleteLayerSuccessCallback,
  );

  const layerSettingsList = layers
    ?.filter((l) => !l.is_alternative)
    .map((l) => {
      return (
        <LayerListItem
          key={'layer_settings_' + l.id}
          layer={l}
          setSelectedLayer={updateSelectedLayer}
          setLayerOpacity={updateLayerOpacity}
        />
      );
    });

  const handleSumbitName = () => {
    createLayer();
    setShowNameModal(false);
  };

  const handleRemoveLayer = () => {
    deleteDrawing;
    deleteLayer();

    setShowConfirmDeleteModal(false);
  };

  return (
    <>
      <div className="flex flex-col p-2">
        <section className="flex justify-between gap-2">
          <h2>{t('layers:header')}</h2>
          <LayerListToolbar
            isAdditionalLayerSelected={selectedLayer.type_ === LayerType.Drawing}
            onAddLayer={() => setShowNameModal(true)}
            onRemoveLayer={() => setShowConfirmDeleteModal(true)}
          />
        </section>
        <section className="mt-6">
          <div className="grid-cols grid grid-cols-[1.5rem_1.5rem_minmax(0,_1fr)] gap-2">
            {layerSettingsList}
          </div>
        </section>
      </div>

      <TransparentBackground show={showNameModal || showConfirmDeleteModal} />

      <ModalContainer show={showNameModal} onCancelKeyPressed={() => setShowNameModal(false)}>
        <div className="flex w-[30vw] flex-col rounded-lg bg-neutral-100 p-6 dark:bg-neutral-100-dark">
          <h2 className="mb-3">{t('layerSettings:enter_layer_name')}</h2>
          <SimpleFormInput
            value={newLayerName}
            onChange={(e) => setNewLayerName(e.target.value)}
            id={''}
            labelContent={''}
          ></SimpleFormInput>
          <div className="flex h-full max-h-[60vh] w-full justify-center p-4"></div>

          <div className="grid grid-cols-2 gap-2">
            <SimpleButton onClick={() => setShowNameModal(false)}>
              {t('common:cancel')}
            </SimpleButton>
            <SimpleButton onClick={handleSumbitName}>{t('common:ok')}</SimpleButton>
          </div>
        </div>
      </ModalContainer>

      <ModalContainer
        show={showConfirmDeleteModal}
        onCancelKeyPressed={() => setShowConfirmDeleteModal(false)}
      >
        <div className="flex w-[30vw] flex-col rounded-lg bg-neutral-100 p-6 dark:bg-neutral-100-dark">
          <h2 className="mb-3">{t('layerSettings:confirm_delete')}</h2>

          <div className="grid grid-cols-2 gap-2">
            <SimpleButton onClick={() => setShowConfirmDeleteModal(false)}>
              {t('common:no')}
            </SimpleButton>
            <SimpleButton onClick={handleRemoveLayer}>{t('common:yes')}</SimpleButton>
          </div>
        </div>
      </ModalContainer>
    </>
  );
};

export type LayerListToolbarProps = {
  onAddLayer: () => void;
  onRemoveLayer: () => void;
  isAdditionalLayerSelected: boolean;
};

/*
    <IconButton disabled={!isAdditionalLayerSelected}>
      <RenameIcon></RenameIcon>
    </IconButton>
    <IconButton disabled>
      <ArrowUpIcon></ArrowUpIcon>
    </IconButton>
    <IconButton disabled>
      <ArrowDownIcon></ArrowDownIcon>
    </IconButton>
*/

const LayerListToolbar = ({
  onAddLayer,
  onRemoveLayer,
  isAdditionalLayerSelected,
}: LayerListToolbarProps) => {
  return (
    <section className="flex justify-between gap-2">
      <IconButton onClick={onAddLayer}>
        <AddIcon></AddIcon>
      </IconButton>
      <IconButton disabled={!isAdditionalLayerSelected}>
        <RemoveIcon onClick={() => onRemoveLayer()}></RemoveIcon>
      </IconButton>
    </section>
  );
};
