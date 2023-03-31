import IconButton from '@/components/Button/IconButton';
import { NamedSlider } from '@/components/Slider/NamedSlider';
import { ReactComponent as EyeOffIcon } from '@/icons/eye-off.svg';
import { ReactComponent as EyeIcon } from '@/icons/eye.svg';
import { useState } from 'react';

export const LayerSettings = ({ name }: { name: string }) => {
  const [layerVisible, setLayerVisible] = useState(false);
  return (
    <>
      <IconButton className="h-full" onClick={() => setLayerVisible(!layerVisible)}>
        {layerVisible ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
      </IconButton>
      <div className="flex items-center justify-center">
        <input className="h-4 w-4" type="checkbox"></input>
      </div>
      <div className="col-span-4">
        <NamedSlider onChange={(percentage) => 1}>{name}</NamedSlider>
      </div>
    </>
  );
};
