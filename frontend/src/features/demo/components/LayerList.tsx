import { LayerObject } from '@/types';
import React from 'react';

interface LayerListProps {
  layers: LayerObject[];
  onHideLayer: (index: number) => void;
}

const LayerList: React.FC<LayerListProps> = ({ layers, onHideLayer }) => {
  const handleClick = (index: number) => {
    onHideLayer(index);
  };

  return (
    <ul>
      {layers.map((layer, index) => (
        <li key={index}>
          <h3>
            Layer {index} (Count {layer.objects.length})
          </h3>
          <button
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            onClick={() => handleClick(index)}
          >
            {layer.visible ? 'Hide' : 'Show'}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default LayerList;
