import useMapStore from '../../store/MapStore';
import { LayerListItem } from './LayerListItem';
import { LayerDto, LayerType } from '@/api_types/definitions';

/* TODO: these imports should be added again when the corresponding functionality of the buttons is implemented */
// import IconButton from '@/components/Button/IconButton';
// import { NamedSlider } from '@/components/Slider/NamedSlider';
// import { ReactComponent as CaretDownIcon } from '@/svg/icons/caret-down.svg';
// import { ReactComponent as CaretRightIcon } from '@/svg/icons/caret-right.svg';
// import { ReactComponent as EyeOffIcon } from '@/svg/icons/eye-off.svg';
// import { ReactComponent as EyeIcon } from '@/svg/icons/eye.svg';
// import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type LayerListProps = {
  layers: LayerDto[];
};

/** Layer controls including visibility, layer selection, opacity and alternatives */
export const LayerList = ({ layers }: LayerListProps) => {
  const updateSelectedLayer = useMapStore((map) => map.updateSelectedLayer);
  const updateLayerOpacity = useMapStore((map) => map.updateLayerOpacity);
  const { t } = useTranslation(['layers']);

  const layerSettingsList = layers
    ?.filter((l) => !l.is_alternative)
    .filter((l) => l.type_ !== LayerType.Shade) // Remove this line after the shade layer has been implemented on the frontend.
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
    <div className="flex flex-col p-2">
      <section className="flex justify-between">
        <h2>{t('layers:header')}</h2>
        {/* TODO: these buttons should be added again when the corresponding functionality is implemented */}
        {/* <div className="flex gap-2"> */}
        {/*   <IconButton disabled={true}> */}
        {/*     <AddIcon className="h-6 w-6" /> */}
        {/*   </IconButton> */}
        {/*   <IconButton disabled={true}> */}
        {/*     <CopyIcon className="h-6 w-6" /> */}
        {/*   </IconButton> */}
        {/*   <IconButton disabled={true}> */}
        {/*     <TrashIcon className="h-6 w-6" /> */}
        {/*   </IconButton> */}
        {/* </div> */}
      </section>
      <section className="mt-6">
        <div className="grid-cols grid grid-cols-[1.5rem_1.5rem_minmax(0,_1fr)] gap-2">
          {layerSettingsList}
        </div>
      </section>
    </div>
  );
};
