import { getPlantings } from '../api/getPlantings';
import { BaseStage } from '../components/BaseStage';
import { Layers } from '../components/toolbar/Layers';
import { Toolbar } from '../components/toolbar/Toolbar';
import { useDefaultLayer } from '../hooks/useDefaultLayer';
import { useMapId } from '../hooks/useMapId';
import PlantsLayer from '../layers/plant/PlantsLayer';
import { PlantLayerLeftToolbar } from '../layers/plant/components/PlantLayerLeftToolbar';
import { PlantLayerRightToolbar } from '../layers/plant/components/PlantLayerRightToolbar';
import useMapStore from '../store/MapStore';
import { handleRemoteAction } from '../store/RemoteActions';
import { ConnectToMapQueryParams, LayerType } from '@/bindings/definitions';
import IconButton from '@/components/Button/IconButton';
import { baseApiUrl } from '@/config';
import BaseLayer from '@/features/map_planning/layers/base/BaseLayer';
import BaseLayerRightToolbar from '@/features/map_planning/layers/base/components/BaseLayerRightToolbar';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { ReactComponent as ArrowIcon } from '@/icons/arrow.svg';
import { ReactComponent as MoveIcon } from '@/icons/move.svg';
import { ReactComponent as PlantIcon } from '@/icons/plant.svg';
import { ReactComponent as RedoIcon } from '@/icons/redo.svg';
import { ReactComponent as UndoIcon } from '@/icons/undo.svg';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

function useInitializeMap() {
  useMapUpdates();
  const initPlantLayer = useMapStore((state) => state.initPlantLayer);
  const mapId = useMapId();
  const plantLayer = useDefaultLayer(mapId, LayerType.Plants);
  const baseLayer = useDefaultLayer(mapId, LayerType.Base);

  useQuery(['plants/plantings', mapId, plantLayer?.id] as const, {
    queryFn: ({ queryKey: [, mapId, plantLayerId] }) => getPlantings(mapId, plantLayerId),
    onSuccess: (data) => {
      if (!baseLayer) return;

      useMapStore.setState((state) => ({
        ...state,
        untrackedState: {
          ...state.untrackedState,
          selectedLayer: baseLayer,
          mapId,
        },
      }));

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
  const executeAction = useMapStore((map) => map.executeAction);
  const selectedLayer = useMapStore((state) => state.untrackedState.selectedLayer);

  const getToolbarContent = (layerType: LayerType) => {
    const content = {
      [LayerType.Base]: {
        left: <div></div>,
        right: (
          <BaseLayerRightToolbar state={trackedState.layers.Base} executeAction={executeAction} />
        ),
      },
      [LayerType.Plants]: { right: <PlantLayerRightToolbar />, left: <PlantLayerLeftToolbar /> },
      [LayerType.Drawing]: { right: <div></div>, left: <div></div> },
      [LayerType.Fertilization]: { right: <div></div>, left: <div></div> },
      [LayerType.Habitats]: { right: <div></div>, left: <div></div> },
      [LayerType.Hydrology]: { right: <div></div>, left: <div></div> },
      [LayerType.Infrastructure]: { right: <div></div>, left: <div></div> },
      [LayerType.Label]: { right: <div></div>, left: <div></div> },
      [LayerType.Landscape]: { right: <div></div>, left: <div></div> },
      [LayerType.Paths]: { right: <div></div>, left: <div></div> },
      [LayerType.Shade]: { right: <div></div>, left: <div></div> },
      [LayerType.Soil]: { right: <div></div>, left: <div></div> },
      [LayerType.Terrain]: { right: <div></div>, left: <div></div> },
      [LayerType.Trees]: { right: <div></div>, left: <div></div> },
      [LayerType.Warnings]: { right: <div></div>, left: <div></div> },
      [LayerType.Winds]: { right: <div></div>, left: <div></div> },
      [LayerType.Zones]: { right: <div></div>, left: <div></div> },
      [LayerType.Todo]: { right: <div></div>, left: <div></div> },
      [LayerType.Photo]: { right: <div></div>, left: <div></div> },
      [LayerType.Watering]: { right: <div></div>, left: <div></div> },
    };

    return content[layerType];
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
          contentBottom={getToolbarContent(untrackedState.selectedLayer.type_).left}
          position="left"
        ></Toolbar>
      </section>
      <BaseStage>
        <BaseLayer
          opacity={untrackedState.layers.Base.opacity}
          visible={untrackedState.layers.Base.visible}
          nextcloudImagePath={trackedState.layers.Base.nextcloudImagePath}
          pixelsPerMeter={trackedState.layers.Base.scale}
          rotation={trackedState.layers.Base.rotation}
        />
        <PlantsLayer
          visible={untrackedState.layers.plants.visible}
          opacity={untrackedState.layers.plants.opacity}
          listening={selectedLayer.type_ === LayerType.Plants}
        ></PlantsLayer>
      </BaseStage>
      <section className="min-h-full bg-neutral-100 dark:bg-neutral-200-dark">
        <Toolbar
          contentTop={<Layers />}
          contentBottom={getToolbarContent(untrackedState.selectedLayer.type_).right}
          position="right"
          minWidth={200}
        ></Toolbar>
      </section>
    </div>
  );
};
