import { BaseStage } from '../components/BaseStage';
import { useEffect, useState } from 'react';
import { Circle, Layer, Rect } from 'react-konva';

/** This component is responsible for rendering the map that the user is going to draw on. */
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
      <Layer>{shapes}</Layer>
    </BaseStage>
  );
};
