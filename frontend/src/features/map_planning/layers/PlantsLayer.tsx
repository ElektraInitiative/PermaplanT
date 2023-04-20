import { Layer } from 'react-konva';

interface PlantsLayerProps {
  children: React.ReactNode;
}

const PlantsLayer = ({ children }: PlantsLayerProps) => {
  return <Layer>{children}</Layer>;
};

export default PlantsLayer;
