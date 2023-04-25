import { BaseStage } from '../components/BaseStage';
import { Layers } from '../components/toolbar/Layers';
import { PlantSearch } from '../components/toolbar/PlantSearch';
import { Toolbar } from '../components/toolbar/Toolbar';
import PlantsLayer from '../layers/PlantsLayer';
import SimpleButton from '@/components/Button/SimpleButton';
import { useEffect, useState } from 'react';
import { Circle, Rect } from 'react-konva';

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
    <div className="flex h-full justify-between">
      <section className="min-h-full bg-neutral-100 dark:bg-neutral-200-dark">
        <Toolbar
          contentTop={
            <div>
              <SimpleButton>Test</SimpleButton>
              <SimpleButton>Test</SimpleButton>
              <SimpleButton>Test</SimpleButton>
              <SimpleButton>Test</SimpleButton>
              <SimpleButton>Test</SimpleButton>
              <SimpleButton>Test</SimpleButton>
            </div>
          }
          contentBottom={
            <div>
              <SimpleButton>Test</SimpleButton>
              <SimpleButton>Test</SimpleButton>
              <SimpleButton>Test</SimpleButton>
              <SimpleButton>Test</SimpleButton>
              <SimpleButton>Test</SimpleButton>
              <SimpleButton>Test</SimpleButton>
            </div>
          }
          position="left"
        ></Toolbar>
      </section>
      <BaseStage>
        <PlantsLayer>{shapes}</PlantsLayer>
      </BaseStage>
      <section className="min-h-full bg-neutral-100 dark:bg-neutral-200-dark">
        <Toolbar contentTop={<Layers />} contentBottom={<PlantSearch />} position="right"></Toolbar>
      </section>
    </div>
  );
};
