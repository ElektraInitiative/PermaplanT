import IconButton from '@/components/Button/IconButton';
import { NamedSlider } from '@/components/Slider/NamedSlider';
import { ReactComponent as CaretDownIcon } from '@/icons/caret-down.svg';
import { ReactComponent as CaretRightIcon } from '@/icons/caret-right.svg';
import { ReactComponent as EyeOffIcon } from '@/icons/eye-off.svg';
import { ReactComponent as EyeIcon } from '@/icons/eye.svg';
import { useState } from 'react';

export const LayerSettings = ({
  name,
  setSelectedLayer,
  setLayerOpacity,
  setLayerAlternative,
  alternatives,
}: {
  name: string;
  setSelectedLayer?: (name: string) => void;
  setLayerOpacity?: (name: string, value: number) => void;
  setLayerAlternative?: (name: string, value: string) => void;
  alternatives?: Array<string>;
}) => {
  const [layerVisible, setLayerVisible] = useState(false);
  const [alternativesVisible, setAlternativesVisible] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center">
        <IconButton title="show/hide layer" onClick={() => setLayerVisible(!layerVisible)}>
          {layerVisible ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
        </IconButton>
      </div>
      <div className="flex items-center justify-center">
        <input
          title="select layer"
          className="h-4 w-4"
          type="radio"
          value={name}
          onClick={() => {
            if (setSelectedLayer) setSelectedLayer(name);
          }}
          name="layer_enable"
        ></input>
      </div>
      <div className="flex items-center">
        {alternatives && alternatives.length > 0 && (
          <IconButton
            className="flex-shrink"
            onClick={() => setAlternativesVisible(!alternativesVisible)}
          >
            {alternativesVisible ? <CaretDownIcon /> : <CaretRightIcon />}
          </IconButton>
        )}
        <NamedSlider
          onChange={(percentage) => {
            if (setLayerOpacity) setLayerOpacity(name, percentage);
          }}
        >
          {name}
        </NamedSlider>
      </div>
      {alternativesVisible &&
        alternatives?.map((a) => (
          <div className="col-span-6 grid grid-cols-6" key={a}>
            <div className="col-span-2"></div>
            <div className="flex items-center justify-center">
              <input
                type="radio"
                value={a}
                name={'alternative_layer_' + name}
                className="h-4 w-4"
                onClick={() => {
                  if (setLayerAlternative) setLayerAlternative(name, a);
                }}
              ></input>
            </div>
            <div className="col-span-3 flex flex-col">{a}</div>
          </div>
        ))}
    </>
  );
};
