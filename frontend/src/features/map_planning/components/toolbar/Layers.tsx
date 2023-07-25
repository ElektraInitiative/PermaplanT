import useMapStore from '../../store/MapStore';
import { LayerList } from './LayerList';
import { LayerDto } from '@/bindings/definitions';
import IconButton from '@/components/Button/IconButton';
import { ReactComponent as AddIcon } from '@/icons/add.svg';
import { ReactComponent as CopyIcon } from '@/icons/copy.svg';
import { ReactComponent as TrashIcon } from '@/icons/trash.svg';
import { useTranslation } from 'react-i18next';

export type LayersProps = {
  layers: LayerDto[];
};

/** Layer controls including visibility, layer selection, opacity and alternatives */
export const Layers = ({ layers }: LayersProps) => {
  const updateSelectedLayer = useMapStore((map) => map.updateSelectedLayer);
  const updateLayerOpacity = useMapStore((map) => map.updateLayerOpacity);
  const { t } = useTranslation(['layers']);

  const layerSettingsList = layers
    ?.filter((l) => !l.is_alternative)
    .map((l) => {
      return (
        <LayerList
          key={'layer_settings_' + l.id}
          layer={l}
          setSelectedLayer={updateSelectedLayer}
          setLayerOpacity={updateLayerOpacity}
        />
      );
    });
  return (
    <div className="flex flex-col p-2">
      <section className="flex justify-between">
        <h2>{t('layers:header')}</h2>
        <div className="flex gap-2">
          <IconButton disabled={true}>
            <AddIcon className="h-6 w-6" />
          </IconButton>
          <IconButton disabled={true}>
            <CopyIcon className="h-6 w-6" />
          </IconButton>
          <IconButton disabled={true}>
            <TrashIcon className="h-6 w-6" />
          </IconButton>
        </div>
      </section>
      <section className="mt-6">
        <div className="grid-cols grid grid-cols-[1.5rem_1.5rem_minmax(0,_1fr)] gap-2">
          {layerSettingsList}
        </div>
      </section>
    </div>
  );
};
