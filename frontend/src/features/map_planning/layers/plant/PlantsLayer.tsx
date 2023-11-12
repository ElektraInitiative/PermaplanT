import useMapStore from '../../store/MapStore';
import { PlantForPlanting } from '../../store/MapStoreTypes';
import { useIsReadOnlyMode } from '../../utils/ReadOnlyModeContext';
import { SELECTION_RECTANGLE_NAME } from '../../utils/ShapesSelection';
import { isPlacementModeActive } from '../../utils/planting-utils';
import { CreatePlantAction, MovePlantAction, TransformPlantAction } from './actions';
import { PlantLayerRelationsOverlay } from './components/PlantLayerRelationsOverlay';
import { PlantingElement } from './components/PlantingElement';
import { LayerType, PlantSpread, PlantingDto, PlantsSummaryDto } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import {
  KEYBINDINGS_SCOPE_PLANTS_LAYER,
  createKeyBindingsAccordingToConfig,
} from '@/config/keybindings';
import { PlantLabel } from '@/features/map_planning/layers/plant/components/PlantLabel';
import { useKeyHandlers } from '@/hooks/useKeyHandlers';
import { ReactComponent as CloseIcon } from '@/svg/icons/close.svg';
import { PlantNameFromPlant } from '@/utils/plant-naming';
import Konva from 'konva';
import { KonvaEventListener, KonvaEventObject, Node } from 'konva/lib/Node';
import { useCallback, useEffect, useRef } from 'react';
import { Group } from 'react-konva';
import * as uuid from 'uuid';

// For performance reasons add limit for amount of plants inside a plant field
const LIMIT_PLANT_FIELD_PLANTS = 1000;

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

  const createPlanting = useCallback(
    (selectedPlantForPlanting: PlantsSummaryDto, xCoordinate: number, yCoordinate: number) => {
      executeAction(
        new CreatePlantAction({
          id: uuid.v4(),
          plantId: selectedPlantForPlanting.id,
          layerId: getSelectedLayerId() ?? -1,
          x: Math.round(xCoordinate),
          y: Math.round(yCoordinate),
          height: getPlantWidth(selectedPlantForPlanting),
          width: getPlantWidth(selectedPlantForPlanting),
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          addDate: timelineDate,
        }),
      );
    },
    [executeAction, getSelectedLayerId, timelineDate],
  );

  const drawPlantField = useCallback(
    (selectedPlantForPlanting: PlantForPlanting) => {
      const drawnField = useMapStore
        .getState()
        .stageRef.current?.findOne(`.${SELECTION_RECTANGLE_NAME}`);

      const fieldWidth = drawnField?.attrs?.width;
      const fieldHeight = drawnField?.attrs?.height;

      if (!fieldWidth || !fieldHeight) return;

      const plantSize = getPlantWidth(selectedPlantForPlanting.plant);
      const { horizontalPlantCount, verticalPlantCount } = calculatePlantCount(
        plantSize,
        fieldWidth,
        fieldHeight,
      );

      const startingPositionX = drawnField.attrs.x;
      const startingPositionY = drawnField.attrs.y;

      // due to set limit of plants in a plant field, we need to decide in which direction we start drawing, i.e. if drawn field is wider than narrow, we start drawing horizontally and vice versa
      const { firstDirectionCounter, secondDirectionCounter } = getDrawingDirectionCounters(
        horizontalPlantCount,
        verticalPlantCount,
      );

      let counter = 0;
      for (let i = 0; i < firstDirectionCounter; i++) {
        for (let j = 0; j < secondDirectionCounter; j++) {
          if (counter++ > LIMIT_PLANT_FIELD_PLANTS) break;

          const horizontalCounter = horizontalPlantCount > verticalPlantCount ? j : i;
          const verticalCounter = horizontalPlantCount > verticalPlantCount ? i : j;

          createPlanting(
            selectedPlantForPlanting.plant,
            startingPositionX + plantSize * horizontalCounter,
            startingPositionY + plantSize * verticalCounter,
          );
        }
      }

      // reset konva rectangle to make sure we always have a rectangle with the newest coordinates when planting
      drawnField.setAttrs({
        width: 0,
        height: 0,
      });
    },
    [createPlanting],
  );

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

      createPlanting(selectedPlant.plant, position.x, position.y);
    },
    [selectedPlant, isReadOnlyMode, createPlanting],
  );

  /**
   * Event handler for unselecting plants
   */
  const handleUnselectPlanting: KonvaEventListener<Konva.Stage, unknown> = useCallback((e) => {
    // only unselect if we are clicking on the background, e.g. not on a plant
    if (e.target instanceof Konva.Shape) {
      return;
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
   * Event handler for selecting plants via the selection rectangle or, if a plant is currently
   * selected for planting, creating a whole field of that plant inside the selection rectangle
   */
  const handleSelectPlanting: KonvaEventListener<Konva.Stage, MouseEvent> = useCallback(() => {
    const selectedPlantings = (foundPlantings: PlantingDto[], konvaNode: Node) => {
      const plantingNode = konvaNode.getAttr('planting');
      return plantingNode ? [...foundPlantings, plantingNode] : [foundPlantings];
    };

    if (isPlacementModeActive()) {
      const selectedPlantForPlanting =
        useMapStore.getState().untrackedState.layers.plants.selectedPlantForPlanting;

      drawPlantField(selectedPlantForPlanting as PlantForPlanting);
      return;
    }

    const transformer = useMapStore.getState().transformer.current;
    const plantings = transformer?.nodes().reduce(selectedPlantings, []);

    if (plantings?.length) {
      useMapStore.getState().selectPlantings(plantings);
    }
  }, [drawPlantField]);

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

  const setStatusPanelContent = useMapStore((state) => state.setStatusPanelContent);
  const clearStatusPanelContent = useMapStore((state) => state.clearStatusPanelContent);

  useEffect(() => {
    if (selectedPlant) {
      setStatusPanelContent(<SelectedPlantInfo plant={selectedPlant.plant} />);
    } else {
      clearStatusPanelContent();
    }
  }, [selectedPlant]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PlantLayerRelationsOverlay />
      <Group {...props} ref={layerRef} name={`${LayerType.Plants}`}>
        {plants.map((o) => (
          <PlantingElement planting={o} key={o.id} />
        ))}
        {plants.map((o) => showPlantLabels && <PlantLabel planting={o} key={o.id} />)}
      </Group>
    </>
  );
}

function SelectedPlantInfo({ plant }: { plant: PlantsSummaryDto }) {
  const selectPlant = useMapStore((state) => state.selectPlantForPlanting);

  const keyHandlerActions: Record<string, () => void> = {
    exitPlantingMode: () => {
      exitPlantingMode();
    },
  };

  useKeyHandlers(
    createKeyBindingsAccordingToConfig(KEYBINDINGS_SCOPE_PLANTS_LAYER, keyHandlerActions),
  );

  return (
    <>
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
    </>
  );
}

export default PlantsLayer;

function calculatePlantCount(
  plantSize: number,
  fieldWidth: number,
  fieldHeight: number,
): { horizontalPlantCount: number; verticalPlantCount: number } {
  const horizontalPlantCount = Math.floor(fieldWidth / plantSize);
  const verticalPlantCount = Math.floor(fieldHeight / plantSize);

  return {
    horizontalPlantCount,
    verticalPlantCount,
  };
}

function getDrawingDirectionCounters(
  horizontalPlantCount: number,
  verticalPlantCount: number,
): { firstDirectionCounter: number; secondDirectionCounter: number } {
  const firstDirectionCounter =
    horizontalPlantCount >= verticalPlantCount ? verticalPlantCount : horizontalPlantCount;

  const secondDirectionCounter =
    horizontalPlantCount >= verticalPlantCount ? horizontalPlantCount : verticalPlantCount;

  return {
    firstDirectionCounter,
    secondDirectionCounter,
  };
}
