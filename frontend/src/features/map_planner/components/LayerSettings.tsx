import IconButton from '@/components/Button/IconButton';
import { NamedSlider } from '@/components/Slider/NamedSlider';
import { ReactComponent as EyeOffIcon } from '@/icons/eye-off.svg';
import { ReactComponent as EyeIcon } from '@/icons/eye.svg';
import { useState } from 'react';

export const LayerSettings = ({
  name,
  setSelectedLayer,
  setLayerOpacity,
}: {
  name: string;
  setSelectedLayer?: (name: string) => void;
  setLayerOpacity?: (name: string, value: number) => void;
}) => {
  const [layerVisible, setLayerVisible] = useState(false);

  return (
    <>
      <IconButton
        title="show/hide layer"
        className="h-full"
        onClick={() => setLayerVisible(!layerVisible)}
      >
        {layerVisible ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
      </IconButton>
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
      <div className="col-span-4">
        <NamedSlider
          onChange={(percentage) => {
            if (setLayerOpacity) setLayerOpacity(name, percentage);
          }}
        >
          {name}
        </NamedSlider>
      </div>
    </>
  );
};
