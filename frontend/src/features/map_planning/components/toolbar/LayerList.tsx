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
import ArrowDownIcon from '@/svg/icons/arrow_down.svg?react';
import ArrowUpIcon from '@/svg/icons/arrow_up.svg?react';
import RenameIcon from '@/svg/icons/rename.svg?react';
import RemoveIcon from '@/svg/icons/trash.svg?react';
import { createLayer } from '../../api/createLayer';
import { useMapId } from '../../hooks/useMapId';
import useMapStore from '../../store/MapStore';
import { LayerListItem } from './LayerListItem';

export type LayerListProps = {
  layers: LayerDto[];
};

/** Layer controls including visibility, layer selection, opacity and alternatives */
export const LayerList = ({ layers }: LayerListProps) => {
  const updateSelectedLayer = useMapStore((map) => map.updateSelectedLayer);
  const updateLayerOpacity = useMapStore((map) => map.updateLayerOpacity);
  const { t } = useTranslation(['layers', 'common']);

  const [newLayerName, setNewLayerName] = React.useState('');
  const [showNameModal, setShowNameModal] = React.useState(false);

  const mapId = useMapId();

  const handleSumbitName = () => {
    createLayer(mapId, LayerType.Drawing, newLayerName);
    setShowNameModal(false);
  };

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
  return (
    <>
      <div className="flex flex-col p-2">
        <section className="flex justify-between gap-2">
          <h2>{t('layers:header')}</h2>
          <LayerListToolbar onAddLayer={() => setShowNameModal(true)} />
        </section>
        <section className="mt-6">
          <div className="grid-cols grid grid-cols-[1.5rem_1.5rem_minmax(0,_1fr)] gap-2">
            {layerSettingsList}
          </div>
        </section>
      </div>

      <TransparentBackground show={showNameModal} />
      <ModalContainer show={showNameModal} onCancelKeyPressed={() => setShowNameModal(false)}>
        <div className="flex h-[15vh] w-[30vw] flex-col rounded-lg bg-neutral-100 p-6 dark:bg-neutral-100-dark">
          <h2 className="mb-3">Name eingeben</h2>
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
    </>
  );
};

export type LayerListToolbarProps = {
  onAddLayer: () => void;
};

const LayerListToolbar = ({ onAddLayer }: LayerListToolbarProps) => {
  return (
    <section className="flex justify-between gap-2">
      <IconButton>
        <RenameIcon></RenameIcon>
      </IconButton>
      <IconButton>
        <ArrowUpIcon></ArrowUpIcon>
      </IconButton>
      <IconButton>
        <ArrowDownIcon></ArrowDownIcon>
      </IconButton>
      <IconButton onClick={() => onAddLayer()}>
        <AddIcon></AddIcon>
      </IconButton>
      <IconButton>
        <RemoveIcon></RemoveIcon>
      </IconButton>
    </section>
  );
};
