import useMapStore from '../../store/MapStore';
import { PlantForPlanting } from '../../store/MapStoreTypes';
import { useIsReadOnlyMode } from '../../utils/ReadOnlyModeContext';
import { SELECTION_RECTANGLE_NAME } from '../../utils/ShapesSelection';
import { useIsPlantLayerActive } from '../../utils/layer-utils';
import { isPlacementModeActive } from '../../utils/planting-utils';
import { CreatePlantAction, MovePlantAction, TransformPlantAction } from './actions';
import { PlantCursor } from './components/PlantCursor';
import { PlantLayerRelationsOverlay } from './components/PlantLayerRelationsOverlay';
import { PlantingElement } from './components/PlantingElement';
import { useDeleteSelectedPlantings } from './hooks/useDeleteSelectedPlantings';
import {
  LayerType,
  PlantSpread,
  PlantingDto,
  PlantsSummaryDto,
  SeedDto,
} from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import {
  KEYBINDINGS_SCOPE_PLANTS_LAYER,
  createKeyBindingsAccordingToConfig,
} from '@/config/keybindings';
import { PlantLabel } from '@/features/map_planning/layers/plant/components/PlantLabel';
import { useKeyHandlers } from '@/hooks/useKeyHandlers';
import CloseIcon from '@/svg/icons/close.svg?react';
import { PlantNameFromPlant, PlantNameFromSeedAndPlant } from '@/utils/plant-naming';
import Konva from 'konva';
import { KonvaEventListener, KonvaEventObject, Node } from 'konva/lib/Node';
import { useCallback, useEffect, useRef } from 'react';
import { Layer } from 'react-konva';
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
    (selectedPlantForPlanting: PlantForPlanting, xCoordinate: number, yCoordinate: number) => {
      executeAction(
        new CreatePlantAction({
          id: uuid.v4(),
          plantId: selectedPlantForPlanting.plant.id,
          seedId: selectedPlantForPlanting.seed?.id,
          layerId: getSelectedLayerId() ?? -1,
          x: Math.round(xCoordinate),
          y: Math.round(yCoordinate),
          height: getPlantWidth(selectedPlantForPlanting.plant),
          width: getPlantWidth(selectedPlantForPlanting.plant),
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          addDate: timelineDate,
          additionalName: selectedPlantForPlanting.seed?.name,
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
            selectedPlantForPlanting,
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

      createPlanting(selectedPlant, position.x, position.y);
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

function usePlantLayerKeyListeners() {
  const { deleteSelectedPlantings } = useDeleteSelectedPlantings();
  const isPlantLayerActive = useIsPlantLayerActive();

  const keybindings = createKeyBindingsAccordingToConfig(KEYBINDINGS_SCOPE_PLANTS_LAYER, {
    deleteSelectedPlantings: () => {
      deleteSelectedPlantings();
    },
  });

  useKeyHandlers(isPlantLayerActive ? keybindings : {});
}

type PlantsLayerProps = Konva.LayerConfig;

function PlantsLayer(props: PlantsLayerProps) {
  usePlantLayerListeners(props.listening || false);
  usePlantLayerKeyListeners();

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
      setStatusPanelContent(
        <SelectedPlantInfo plant={selectedPlant.plant} seed={selectedPlant.seed} />,
      );
    } else {
      clearStatusPanelContent();
    }
  }, [selectedPlant]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PlantLayerRelationsOverlay />
      <Layer {...props} ref={layerRef} name={`${LayerType.Plants}`}>
        {plants.map((o) => (
          <PlantingElement planting={o} key={o.id} />
        ))}
        {plants.map((o) => showPlantLabels && <PlantLabel planting={o} key={o.id} />)}
      </Layer>
      <Layer listening={false}>
        <PlantCursor />
      </Layer>
    </>
  );
}

function SelectedPlantInfo({ plant, seed }: { plant: PlantsSummaryDto; seed: SeedDto | null }) {
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
        {seed ? (
          <PlantNameFromSeedAndPlant seed={seed} plant={plant} />
        ) : (
          <PlantNameFromPlant plant={plant} />
        )}
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
