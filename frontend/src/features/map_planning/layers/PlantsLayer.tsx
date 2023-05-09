import Konva from 'konva';
import { Layer } from 'react-konva';

interface PlantsLayerProps extends Konva.LayerConfig {
  children: JSX.Element[];
}

const PlantsLayer = ({ children, ...props }: PlantsLayerProps) => {
  return <Layer {...props}>{children}</Layer>;
};

export default PlantsLayer;
