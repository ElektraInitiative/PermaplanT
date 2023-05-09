import { BaseStage } from '../components/BaseStage';
import BaseLayer from '../layers/BaseLayer';
import { Layers } from '../components/toolbar/Layers';
import { PlantSearch } from '../components/toolbar/PlantSearch';
import { Toolbar } from '../components/toolbar/Toolbar';
import PlantsLayer from '../layers/PlantsLayer';
import IconButton from '@/components/Button/IconButton';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import { ReactComponent as ArrowIcon } from '@/icons/arrow.svg';
import { ReactComponent as MoveIcon } from '@/icons/move.svg';
import { ReactComponent as PlantIcon } from '@/icons/plant.svg';
import { ReactComponent as RedoIcon } from '@/icons/redo.svg';
import { ReactComponent as UndoIcon } from '@/icons/undo.svg';
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
          minWidth={160}
          contentTop={
            <div>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <PlantIcon></PlantIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <ArrowIcon></ArrowIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <RedoIcon></RedoIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <UndoIcon></UndoIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <MoveIcon></MoveIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <PlantIcon></PlantIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <PlantIcon></PlantIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <PlantIcon></PlantIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <PlantIcon></PlantIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <PlantIcon></PlantIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <PlantIcon></PlantIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <PlantIcon></PlantIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <PlantIcon></PlantIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <PlantIcon></PlantIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <PlantIcon></PlantIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <PlantIcon></PlantIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <PlantIcon></PlantIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <PlantIcon></PlantIcon>
              </IconButton>
              <IconButton className="m-2 h-8 w-8 border border-neutral-500 p-1">
                <PlantIcon></PlantIcon>
              </IconButton>
            </div>
          }
          contentBottom={
            <div className="flex flex-col gap-2 p-2">
              <h2>Edit attributes</h2>
              <SimpleFormInput
                id="input1"
                labelText="Some attribute"
                placeholder="some input"
              ></SimpleFormInput>
              <SimpleFormInput
                id="input1"
                labelText="Some attribute"
                placeholder="some input"
              ></SimpleFormInput>
              <SimpleFormInput
                id="input1"
                labelText="Some attribute"
                placeholder="some input"
              ></SimpleFormInput>
              <SimpleFormInput
                id="input1"
                labelText="Some attribute"
                placeholder="some input"
              ></SimpleFormInput>
              <SimpleFormInput
                id="input1"
                labelText="Some attribute"
                placeholder="some input"
              ></SimpleFormInput>
              <SimpleButton>Submit data</SimpleButton>
            </div>
          }
          position="left"
        ></Toolbar>
      </section>
      <BaseStage>
        <PlantsLayer>{shapes}</PlantsLayer>
        <BaseLayer
            imageUrl="https://nextcloud.markus-raab.org/nextcloud/index.php/s/E4TTrPnpt4Qfade/download/garden-plan.jpg"
            rotation={0}
            pixels_per_meter={5}
        />
      </BaseStage>
      <section className="min-h-full bg-neutral-100 dark:bg-neutral-200-dark">
        <Toolbar
          contentTop={<Layers />}
          contentBottom={<PlantSearch />}
          position="right"
          minWidth={200}
        ></Toolbar>
      </section>
    </div>
  );
};
