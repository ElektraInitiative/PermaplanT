import useMapStore from '../../store/MapStore';
import { LayerDto, LayerType } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import { NamedSlider } from '@/components/Slider/NamedSlider';
import { ReactComponent as CaretDownIcon } from '@/svg/icons/caret-down.svg';
import { ReactComponent as CaretRightIcon } from '@/svg/icons/caret-right.svg';
import { ReactComponent as EyeOffIcon } from '@/svg/icons/eye-off.svg';
import { ReactComponent as EyeIcon } from '@/svg/icons/eye.svg';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LayerListProps {
  /** layer which is controlled by this list element */
  layer: LayerDto;
  /** callback that gets triggered when the layer is selected */
  setSelectedLayer?: (layer: LayerDto) => void;
  /** callback that gets triggered when slider value is changed */
  setLayerOpacity?: (name: LayerType, value: number) => void;
  /** callback that gets triggered when an alternative is selected */
  setLayerAlternative?: (name: LayerType, value: string) => void;
  /**
   * list of names of the possible alternatives for this layer
   * if alternatives are given they can be selected in a menu
   **/
  alternatives?: Array<string>;
}

/** Layer setting UI to control visibility, layer selection, opacity and alternatives */
export const LayerListItem = ({
  layer,
  setSelectedLayer,
  setLayerOpacity,
  setLayerAlternative,
  alternatives,
}: LayerListProps) => {
  const layerVisible = useMapStore((map) => map.untrackedState.layers[layer.type_].visible);
  const selectedLayer = useMapStore((map) => map.untrackedState.selectedLayer);
  const updateLayerVisible = useMapStore((map) => map.updateLayerVisible);
  const [alternativesVisible, setAlternativesVisible] = useState(false);
  const { t } = useTranslation(['layerSettings', 'layers']);

  // If a frontend only layer is active, no other layer should be selected.
  const selectedLayerId = typeof selectedLayer === 'object' ? selectedLayer.id : null;

  return (
    <>
      <div className="flex items-center justify-center">
        <IconButton
          title={t('layerSettings:show_hide_layer')}
          onClick={() => updateLayerVisible(layer.type_, !layerVisible)}
          data-testid={`layer-list-item__${layer.type_}-layer-visibility-icon`}
        >
          {layerVisible ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
        </IconButton>
      </div>
      <div className="flex items-center justify-center">
        <input
          title={t('layerSettings:select_layer')}
          className="h-4 w-4"
          type="radio"
          value={layer.name}
          checked={selectedLayerId === layer.id}
          onChange={() => {
            if (setSelectedLayer) setSelectedLayer(layer);
          }}
          name="layer_enable"
          data-tourid={`${layer.type_}_select`}
          data-testid={`layer-list-item__${layer.type_}-layer-radio`}
        ></input>
      </div>
      <div className="flex items-center">
        {alternatives && alternatives.length > 0 && (
          <IconButton
            className="shrink"
            onClick={() => setAlternativesVisible(!alternativesVisible)}
          >
            {alternativesVisible ? <CaretDownIcon /> : <CaretRightIcon />}
          </IconButton>
        )}
        <NamedSlider
          onChange={(percentage) => {
            if (setLayerOpacity) setLayerOpacity(layer.type_, percentage);
          }}
          title={t('layerSettings:sliderTooltip')}
          value={1}
        >
          {t(`layers:${layer.type_}`)}
        </NamedSlider>
      </div>
      {alternativesVisible &&
        alternatives?.map((a) => (
          <div className="col-span-3 grid grid-cols-[1.5rem_1.5rem_minmax(0,_1fr)] gap-2" key={a}>
            <div className="col-span-2"></div>
            <div className="flex items-center justify-start gap-2">
              <input
                type="radio"
                value={a}
                name={'alternative_layer_' + name}
                className="h-4 w-4"
                onClick={() => {
                  if (setLayerAlternative) setLayerAlternative(layer.type_, a);
                }}
              ></input>
              <div className="flex flex-col">{a}</div>
            </div>
          </div>
        ))}
    </>
  );
};
