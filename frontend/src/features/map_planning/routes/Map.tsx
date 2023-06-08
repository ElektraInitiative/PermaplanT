import { getPlantings } from '../api/getPlantings';
import { BaseStage } from '../components/BaseStage';
import { Layers } from '../components/toolbar/Layers';
import { PlantSearch } from '../components/toolbar/PlantSearch';
import { Toolbar } from '../components/toolbar/Toolbar';
import PlantsLayer from '../layers/plant/PlantsLayer';
import useMapStore from '../store/MapStore';
import { LayerName } from '../store/MapStoreTypes';
import { handleRemoteAction } from '../store/RemoteActions';
import { ConnectToMapQueryParams } from '@/bindings/definitions';
import IconButton from '@/components/Button/IconButton';
import SimpleButton from '@/components/Button/SimpleButton';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import { baseApiUrl } from '@/config';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { ReactComponent as ArrowIcon } from '@/icons/arrow.svg';
import { ReactComponent as MoveIcon } from '@/icons/move.svg';
import { ReactComponent as PlantIcon } from '@/icons/plant.svg';
import { ReactComponent as RedoIcon } from '@/icons/redo.svg';
import { ReactComponent as UndoIcon } from '@/icons/undo.svg';
import { useQuery } from '@tanstack/react-query';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { useEffect, useRef } from 'react';
import { Rect } from 'react-konva';

function useInitializeMap() {
  useMapUpdates();
  const initPlantLayer = useMapStore((state) => state.initPlantLayer);
  const mapId = '1';

  useQuery(['plants/plantings', mapId], {
    queryFn: (context) => getPlantings(context.queryKey[1]),
    onSuccess: (data) => {
      initPlantLayer(data);
    },
  });
}

function useMapUpdates() {
  const { user } = useSafeAuth();
  const evRef = useRef<EventSource>();

  useEffect(() => {
    if (user) {
      const connectionQuery: ConnectToMapQueryParams = {
        map_id: 1,
        user_id: user.profile.sub,
      };

      const connectionParams = new URLSearchParams();
      connectionParams.append('map_id', `${connectionQuery.map_id}`);
      connectionParams.append('user_id', connectionQuery.user_id);

      // TODO: implement protected routes and authentication
      evRef.current = new EventSource(
        `${baseApiUrl}/api/updates/maps?${connectionParams.toString()}`,
      );
      evRef.current.onmessage = (ev) => handleRemoteAction(ev, user);
    }

    return () => {
      evRef.current?.close();
    };
  }, [user]);
}

/**
 * This component is responsible for rendering the map that the user is going to draw on.
 * In order to add a new layer you can add another layer file under the "layers" folder.
 * Features such as zooming and panning are handled by the BaseStage component.
 * You only have to make sure that every shape has the property "draggable" set to true.
 * Otherwise they cannot be moved.
 */
export const Map = () => {
  useInitializeMap();

  const trackedState = useMapStore((map) => map.trackedState);
  const untrackedState = useMapStore((map) => map.untrackedState);
  const undo = useMapStore((map) => map.undo);
  const redo = useMapStore((map) => map.redo);
  const addShapeToTransformer = useMapStore((map) => map.addShapeToTransformer);
  const selectedLayer = useMapStore((state) => state.untrackedState.selectedLayer);

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
                onClick={() => undo()}
              >
                <UndoIcon></UndoIcon>
              </IconButton>
              <IconButton
                className="m-2 h-8 w-8 border border-neutral-500 p-1"
                onClick={() => redo()}
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
          contentBottom={getToolbarContent(untrackedState.selectedLayer).left}
          position="left"
        ></Toolbar>
      </section>
      <BaseStage>
        <PlantsLayer
          visible={untrackedState.layers.Plant.visible}
          opacity={untrackedState.layers.Plant.opacity}
          listening={selectedLayer === 'Plant'}
        >
          {trackedState.layers['Plant'].objects.map((o) => (
            <Rect
              {...o}
              key={o.id}
              fill="blue"
              draggable={true}
              shadowBlur={5}
              onClick={(e) => {
                addShapeToTransformer(e.target as Shape<ShapeConfig>);
              }}
              onDragStart={(e) => {
                // sometimes the click event is not fired, so we have to add the object to the transformer here
                addShapeToTransformer(e.target as Shape<ShapeConfig>);
              }}
            />
          ))}
        </PlantsLayer>
      </BaseStage>
      <section className="min-h-full bg-neutral-100 dark:bg-neutral-200-dark">
        <Toolbar
          contentTop={<Layers />}
          contentBottom={getToolbarContent(untrackedState.selectedLayer).right}
          position="right"
          minWidth={200}
        ></Toolbar>
      </section>
    </div>
  );
};
