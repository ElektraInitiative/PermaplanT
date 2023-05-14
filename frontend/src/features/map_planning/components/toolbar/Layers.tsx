import { LayerList } from './LayerList';
import IconButton from '@/components/Button/IconButton';
import useMapStore, { LayerName } from '@/features/undo_redo';
import { ReactComponent as AddIcon } from '@/icons/add.svg';
import { ReactComponent as CopyIcon } from '@/icons/copy.svg';
import { ReactComponent as TrashIcon }from '@/icons/trash.svg';

/** Layer controls including visibility, layer selection, opacity and alternatives */
export const Layers = () => {
  const updateSelectedLayer = useMapStore((map) => map.updateSelectedLayer);
  const updateLayerOpacity = useMapStore((map) => map.updateLayerOpacity);

  const layerNames: Array<LayerName> = [
    'Base',
    'Plant',
    'Drawing',
    'Dimension',
    'Fertilization',
    'Habitats',
    'Hydrology',
    'Infrastructure',
    'Labels',
    'Landscape',
    'Paths',
    'Shade',
    'Soil',
    'Terrain',
    'Trees',
    'Warnings',
    'Winds',
    'Zones',
  ];
  const layerSettingsList = layerNames.map((name) => {
    return (
      <LayerList
        key={'layer_settings_' + name}
        name={name}
        setSelectedLayer={(name) => {
          updateSelectedLayer(name);
        }}
        setLayerOpacity={(name, value) => {
          updateLayerOpacity(name, value);
        }}
      />
    );
  });
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
          {layerSettingsList}
        </div>
      </section>
    </div>
  );
};
