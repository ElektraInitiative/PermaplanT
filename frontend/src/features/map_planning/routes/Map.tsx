import { BaseStage } from '../components/BaseStage';
import PlantsLayer from '../layers/PlantsLayer';
import { useEffect, useState } from 'react';
import { Circle, Rect } from 'react-konva';
import BaseLayer from '../layers/BaseLayer';
import { Input } from 'postcss';

/**
 * This component is responsible for rendering the map that the user is going to draw on.
 * In order to add a new layer you can add another layer file under the "layers" folder.
 * Features such as zooming and panning are handled by the BaseStage component.
 * You only have to make sure that every shape has the property "draggable" set to true.
 * Otherwise they cannot be moved.
 */
export const Map = () => {
  const [shapes, setShapes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newShapes = [];
    for (let i = 1; i <= 10; i++) {
      newShapes.push(
        <Circle
          key={i}
          x={100 * i}
          y={100 * i}
          radius={50}
          fill="red"
          draggable={true}
          shadowBlur={5}
        />,
        <Rect
          key={i + 100}
          x={100 * i + 200}
          y={100 * i + 10}
          width={100}
          height={100}
          fill="blue"
          draggable={true}
          shadowBlur={5}
        />,
      );
    }
    setShapes(newShapes);
  }, []);

  return (
    <BaseStage>
      <BaseLayer imageUrl='https://nextcloud.markus-raab.org/nextcloud/index.php/s/E4TTrPnpt4Qfade/download/garden-plan.jpg' rotation={0} pixels_per_meter={5} />
      <PlantsLayer>{shapes}</PlantsLayer>
    </BaseStage>
  );
};
