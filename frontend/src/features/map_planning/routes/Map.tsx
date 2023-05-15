import { BaseStage } from '../components/BaseStage';
import { Layers } from '../components/toolbar/Layers';
import { PlantSearch } from '../components/toolbar/PlantSearch';
import { Toolbar } from '../components/toolbar/Toolbar';
import PlantsLayer from '../layers/PlantsLayer';
import IconButton from '@/components/Button/IconButton';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import useMapStore, { LayerName } from '@/features/undo_redo';
import { ReactComponent as ArrowIcon } from '@/icons/arrow.svg';
import { ReactComponent as MoveIcon } from '@/icons/move.svg';
import { ReactComponent as PlantIcon } from '@/icons/plant.svg';
import { ReactComponent as RedoIcon } from '@/icons/redo.svg';
import { ReactComponent as UndoIcon } from '@/icons/undo.svg';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Rect } from 'react-konva';

/**
 * This component is responsible for rendering the map that the user is going to draw on.
 * In order to add a new layer you can add another layer file under the "layers" folder.
 * Features such as zooming and panning are handled by the BaseStage component.
 * You only have to make sure that every shape has the property "draggable" set to true.
 * Otherwise they cannot be moved.
 */
export const Map = () => {
  const state = useMapStore((map) => map.state);
  const dispatch = useMapStore((map) => map.dispatch);

  // Event listener responsible for adding a single shape to the transformer
  const addToTransformer = (node: Shape<ShapeConfig>) => {
    const transformer = useMapStore.getState().transformer.current;

    const nodes = transformer?.getNodes() || [];
    if (!nodes.includes(node)) {
      transformer?.nodes([node]);
    }
  };

  const formPlaceholder = (
    <div className="flex flex-col gap-2 p-2">
      <h2>Edit attributes</h2>
      <SimpleFormInput
        id="input1"
        labelText="Some attribute"
        placeHolder="some input"
      ></SimpleFormInput>
      <SimpleFormInput
        id="input1"
        labelText="Some attribute"
        placeHolder="some input"
      ></SimpleFormInput>
      <SimpleFormInput
        id="input1"
        labelText="Some attribute"
        placeHolder="some input"
      ></SimpleFormInput>
      <SimpleFormInput
        id="input1"
        labelText="Some attribute"
        placeHolder="some input"
      ></SimpleFormInput>
      <SimpleFormInput
        id="input1"
        labelText="Some attribute"
        placeHolder="some input"
      ></SimpleFormInput>
      <SimpleButton>Submit data</SimpleButton>
    </div>
  );

  const getToolbarContent = (layerName: LayerName) => {
    const content = {
      Base: { right: <div></div>, left: <div></div> },
      Plant: { right: <PlantSearch />, left: formPlaceholder },
      Drawing: { right: <div></div>, left: <div></div> },
      Dimension: { right: <div></div>, left: <div></div> },
      Fertilization: { right: <div></div>, left: <div></div> },
      Habitats: { right: <div></div>, left: <div></div> },
      Hydrology: { right: <div></div>, left: <div></div> },
      Infrastructure: { right: <div></div>, left: <div></div> },
      Labels: { right: <div></div>, left: <div></div> },
      Landscape: { right: <div></div>, left: <div></div> },
      Paths: { right: <div></div>, left: <div></div> },
      Shade: { right: <div></div>, left: <div></div> },
      Soil: { right: <div></div>, left: <div></div> },
      Terrain: { right: <div></div>, left: <div></div> },
      Trees: { right: <div></div>, left: <div></div> },
      Warnings: { right: <div></div>, left: <div></div> },
      Winds: { right: <div></div>, left: <div></div> },
      Zones: { right: <div></div>, left: <div></div> },
    };
    return content[layerName];
  };

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
              <IconButton
                className="m-2 h-8 w-8 border border-neutral-500 p-1"
                onClick={() => dispatch({ type: 'UNDO' })}
              >
                <UndoIcon></UndoIcon>
              </IconButton>
              <IconButton
                className="m-2 h-8 w-8 border border-neutral-500 p-1"
                onClick={() => dispatch({ type: 'REDO' })}
              >
                <RedoIcon></RedoIcon>
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
          contentBottom={getToolbarContent(state.selectedLayer).left}
          position="left"
        ></Toolbar>
      </section>
      <BaseStage>
        <PlantsLayer visible={state.layers.Plant.visible} opacity={state.layers.Plant.opacity}>
          {state.layers['Plant'].objects.map((o) => (
            <Rect
              {...o}
              key={o.id}
              fill="blue"
              draggable={true}
              shadowBlur={5}
              onClick={(e) => {
                addToTransformer(e.target as Shape<ShapeConfig>);
              }}
              onDragStart={(e) => {
                // sometimes the click event is not fired, so we have to add the object to the transformer here
                addToTransformer(e.target as Shape<ShapeConfig>);
              }}
            />
          ))}
        </PlantsLayer>
      </BaseStage>
      <section className="min-h-full bg-neutral-100 dark:bg-neutral-200-dark">
        <Toolbar
          contentTop={<Layers />}
          contentBottom={getToolbarContent(state.selectedLayer).right}
          position="right"
          minWidth={200}
        ></Toolbar>
      </section>
    </div>
  );
};
