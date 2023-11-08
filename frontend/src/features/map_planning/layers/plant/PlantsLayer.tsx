import useMapStore from '../../store/MapStore';
import { useIsReadOnlyMode } from '../../utils/ReadOnlyModeContext';
import { CreatePlantAction, MovePlantAction, TransformPlantAction } from './actions';
import { PlantLayerRelationsOverlay } from './components/PlantLayerRelationsOverlay';
import { PlantingElement } from './components/PlantingElement';
import { LayerType, PlantSpread, PlantingDto, PlantsSummaryDto } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import { PlantLabel } from '@/features/map_planning/layers/plant/components/PlantLabel';
import { useKeyHandlers } from '@/hooks/useKeyHandlers';
import { ReactComponent as CloseIcon } from '@/svg/icons/close.svg';
import { PlantNameFromPlant } from '@/utils/plant-naming';
import { AnimatePresence, motion } from 'framer-motion';
import Konva from 'konva';
import { KonvaEventListener, KonvaEventObject, Node } from 'konva/lib/Node';
import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Layer } from 'react-konva';
import { Html } from 'react-konva-utils';
import * as uuid from 'uuid';

const PLANT_WIDTHS = new Map<PlantSpread, number>([
  [PlantSpread.Narrow, 10],
  [PlantSpread.Medium, 50],
  [PlantSpread.Wide, 100],
]);

function getPlantWidth({ spread = PlantSpread.Medium }): number {
  return PLANT_WIDTHS.get(spread) ?? (PLANT_WIDTHS.get(PlantSpread.Medium) as number);
}

function exitPlantingMode() {
  useMapStore.getState().selectPlantings(null);
}

function usePlantLayerListeners(listening: boolean) {
  const executeAction = useMapStore((state) => state.executeAction);
  const selectedPlant = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantForPlanting,
  );
  const timelineDate = useMapStore((state) => state.untrackedState.timelineDate);
  const getSelectedLayerId = useMapStore((state) => state.getSelectedLayerId);
  const isReadOnlyMode = useIsReadOnlyMode();

  /**
   * Event handler for planting plants
   */
  const handleCreatePlanting: KonvaEventListener<Konva.Stage, unknown> = useCallback(
    (e) => {
      const getPositionForPlantPlacement = (e: KonvaEventObject<MouseEvent | unknown>) => {
        return e.currentTarget.getRelativePointerPosition();
      };

      if (!selectedPlant || isReadOnlyMode) {
        return;
      }

      const position = getPositionForPlantPlacement(e);
      if (!position) {
        return;
      }

      const width = getPlantWidth(selectedPlant.plant);

      executeAction(
        new CreatePlantAction({
          id: uuid.v4(),
          plantId: selectedPlant.plant.id,
          layerId: getSelectedLayerId() ?? -1,
          // consider the offset of the stage and size of the element
          x: Math.round(position.x),
          y: Math.round(position.y),
          height: width,
          width: width,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          addDate: timelineDate,
          seedId: selectedPlant.seed?.id,
        }),
      );
    },
    [getSelectedLayerId, executeAction, selectedPlant, timelineDate, isReadOnlyMode],
  );

  /**
   * Event handler for unselecting plants
   */
  const handleUnselectPlanting: KonvaEventListener<Konva.Stage, unknown> = useCallback((e) => {
    // only unselect if we are clicking on the background, e.g. not on a plant
    if (e.target instanceof Konva.Shape) {
      return;
    }

    const transformer = useMapStore.getState().transformer.current;
    if (transformer?.nodes().length === 0) {
      useMapStore.getState().selectPlantings(null);
    }

    // only unselect if we are not planting a new plant
    const selectedPlantForPlanting =
      useMapStore.getState().untrackedState.layers.plants.selectedPlantForPlanting;
    if (selectedPlantForPlanting) {
      return;
    }

    exitPlantingMode();
  }, []);

  /**
   * Event handler for selecting plants via the selection rectangle
   */
  const handleSelectPlanting: KonvaEventListener<Konva.Stage, MouseEvent> = useCallback(() => {
    const selectedPlantings = (foundPlantings: PlantingDto[], konvaNode: Node) => {
      const plantingNode = konvaNode.getAttr('planting');
      return plantingNode ? [...foundPlantings, plantingNode] : [foundPlantings];
    };

    const transformer = useMapStore.getState().transformer.current;
    const plantings = transformer?.nodes().reduce(selectedPlantings, []);

    if (plantings?.length) {
      useMapStore.getState().selectPlantings(plantings);
    }
  }, []);

  /**
   * Event handler for transforming plants
   */
  const handleTransformPlanting: KonvaEventListener<Konva.Transformer, unknown> =
    useCallback(() => {
      const updates = (useMapStore.getState().transformer.current?.getNodes() || []).map((node) => {
        return {
          id: node.id(),
          x: Math.round(node.x()),
          y: Math.round(node.y()),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
        };
      });

      executeAction(new TransformPlantAction(updates));
    }, [executeAction]);

  /**
   * Event handler for moving plants
   */
  const handleMovePlanting: KonvaEventListener<Konva.Transformer, unknown> = useCallback(() => {
    const updates = (useMapStore.getState().transformer.current?.getNodes() || []).map((node) => {
      return {
        id: node.id(),
        x: Math.round(node.x()),
        y: Math.round(node.y()),
      };
    });

    executeAction(new MovePlantAction(updates));
  }, [executeAction]);

  useKeyHandlers({
    Escape: () => {
      if (selectedPlant) {
        exitPlantingMode();
      }
    },
  });

  useEffect(() => {
    if (!listening) {
      return;
    }
    useMapStore.getState().stageRef.current?.on('click.placePlant', handleCreatePlanting);
    useMapStore.getState().stageRef.current?.on('click.unselectPlanting', handleUnselectPlanting);
    useMapStore.getState().stageRef.current?.on('mouseup.selectPlanting', handleSelectPlanting);
    useMapStore.getState().transformer.current?.on('transformend.plants', handleTransformPlanting);
    useMapStore.getState().transformer.current?.on('dragend.plants', handleMovePlanting);

    return () => {
      useMapStore.getState().stageRef.current?.off('click.placePlant');
      useMapStore.getState().stageRef.current?.off('click.unselectPlanting');
      useMapStore.getState().transformer.current?.off('transformend.plants');
      useMapStore.getState().transformer.current?.off('dragend.plants');
      useMapStore.getState().stageRef.current?.off('mouseup.selectPlanting');
    };
  }, [
    listening,
    handleCreatePlanting,
    handleTransformPlanting,
    handleMovePlanting,
    handleUnselectPlanting,
    handleSelectPlanting,
  ]);
}

type PlantsLayerProps = Konva.LayerConfig;

function PlantsLayer(props: PlantsLayerProps) {
  usePlantLayerListeners(props.listening || false);
  const layerRef = useRef<Konva.Layer>(null);

  const plants = useMapStore((map) => map.trackedState.layers.plants.objects);
  const selectedPlant = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantForPlanting,
  );
  const showPlantLabels = useMapStore((state) => state.untrackedState.layers.plants.showLabels);

  const portalRef = useRef<HTMLDivElement>(
    document.getElementById('bottom-portal') as HTMLDivElement,
  );

  return (
    <>
      <PlantLayerRelationsOverlay />
      <Layer {...props} ref={layerRef} name={`${LayerType.Plants}`}>
        {plants.map((o) => (
          <PlantingElement planting={o} key={o.id} />
        ))}
        {plants.map((o) => showPlantLabels && <PlantLabel planting={o} key={o.id} />)}

        <Html>
          {createPortal(
            <AnimatePresence mode="wait">
              {selectedPlant && <SelectedPlantInfo plant={selectedPlant.plant} />}
            </AnimatePresence>,
            portalRef.current,
          )}
        </Html>
      </Layer>
    </>
  );
}

function SelectedPlantInfo({ plant }: { plant: PlantsSummaryDto }) {
  const selectPlant = useMapStore((state) => state.selectPlantForPlanting);

  return (
    <motion.div
      className="flex gap-4 rounded-md bg-neutral-200 py-3 pl-6 pr-4 ring ring-secondary-500 dark:bg-neutral-200-dark"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 100,
        transition: { delay: 0, duration: 0.1 },
      }}
      exit={{
        opacity: 0,
        transition: { delay: 0, duration: 0.1 },
      }}
    >
      <div className="flex flex-row items-center justify-center">
        <PlantNameFromPlant plant={plant} />
      </div>
      <div className="flex items-center justify-center">
        <IconButton
          className="m-2 h-8 w-8 border border-neutral-500 p-1"
          onClick={() => selectPlant(null)}
          data-tourid="placement_cancel"
        >
          <CloseIcon></CloseIcon>
        </IconButton>
      </div>
    </motion.div>
  );
}

export default PlantsLayer;
