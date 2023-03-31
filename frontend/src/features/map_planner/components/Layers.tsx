import { LayerSettings } from './LayerSettings';
import IconButton from '@/components/Button/IconButton';
import { ReactComponent as AddIcon } from '@/icons/add.svg';
import { ReactComponent as CopyIcon } from '@/icons/copy.svg';
import { ReactComponent as TrashIcon } from '@/icons/trash.svg';

export const Layers = () => {
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
        <div className="grid grid-cols-6 gap-2">
          <label className="text-center text-sm">vis</label>
          <label className="text-center text-sm">enabl</label>
          <div className="col-span-4"></div>
          <LayerSettings name="Landscape" />
          <LayerSettings name="Plants" />
          <LayerSettings name="Zones" />
        </div>
      </section>
    </div>
  );
};
