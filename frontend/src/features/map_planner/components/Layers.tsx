import IconButton from '@/components/Button/IconButton';
import { NamedSlider } from '@/components/Slider/NamedSlider';
import { ReactComponent as AddIcon } from '@/icons/add.svg';
import { ReactComponent as CopyIcon } from '@/icons/copy.svg';
import { ReactComponent as EyeOffIcon } from '@/icons/eye-off.svg';
import { ReactComponent as EyeIcon } from '@/icons/eye.svg';
import { ReactComponent as TrashIcon } from '@/icons/trash.svg';
import { useState } from 'react';

export const Layers = () => {
  const [layerVisible, setLayerVisible] = useState(false);
  return (
    <div className="flex flex-col">
      <section className="flex justify-between">
        <h2>Layers</h2>
        <div className="flex gap-2">
          <IconButton>
            <AddIcon className="h-6 w-6" />
          </IconButton>
          <IconButton>
            <CopyIcon className="h-6 w-6" />
          </IconButton>
          <IconButton>
            <TrashIcon className="h-6 w-6" />
          </IconButton>
        </div>
      </section>
      <section className="mt-6">
        <div className='grid grid-cols-6 gap-2'>
          <label className='text-sm text-center'>vis</label>
          <label className='text-sm text-center'>enabl</label>
          <div className='col-span-4'></div>
          <IconButton onClick={() => setLayerVisible(!layerVisible)}>
            {layerVisible ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeOffIcon className="h-5 w-5" />
            )}
          </IconButton>
          <div className='flex justify-center items-center'>
            <input className='w-4 h-4' type="checkbox"></input>
          </div>
          <div className='col-span-4'><NamedSlider onChange={percentage => 1}>Layer 1</NamedSlider></div>
        </div>
      </section>
    </div>
  );
};
