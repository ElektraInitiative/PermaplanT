import { LayerSettings } from './LayerSettings';
import IconButton from '@/components/Button/IconButton';
import { ReactComponent as AddIcon } from '@/icons/add.svg';
import { ReactComponent as CopyIcon } from '@/icons/copy.svg';
import { ReactComponent as TrashIcon } from '@/icons/trash.svg';

export const Layers = () => {
  return (
    <div className="flex flex-col p-2">
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
        <div className="grid-cols grid grid-cols-[1.5rem_1.5rem_minmax(0,_1fr)] gap-2">
          <LayerSettings name="Dimension" />
          <LayerSettings name="Draw" alternatives={['draw1', 'draw2']} />
          <LayerSettings name="Fertilize" />
          <LayerSettings name="Habitats" />
          <LayerSettings name="Hydrology" />
          <LayerSettings name="Infrastructure" />
          <LayerSettings name="Labels" />
          <LayerSettings name="Landscape" />
          <LayerSettings name="Paths" />
          <LayerSettings name="Plants" />
          <LayerSettings name="Shadows" />
          <LayerSettings name="Soil" />
          <LayerSettings name="Terrain" />
          <LayerSettings name="Trees" />
          <LayerSettings name="Warnings" />
          <LayerSettings name="Winds" />
          <LayerSettings name="Zones" />
        </div>
      </section>
    </div>
  );
};
