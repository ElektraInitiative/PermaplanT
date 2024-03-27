import Konva from 'konva';
import { KonvaEventListener, KonvaEventObject, Node } from 'konva/lib/Node';
import { useCallback, useEffect, useRef } from 'react';
import { Layer } from 'react-konva';
import * as uuid from 'uuid';
import { LayerType, PlantingDto, PlantsSummaryDto, SeedDto } from '@/api_types/definitions';
import {
  KEYBINDINGS_SCOPE_PLANTS_LAYER,
  createKeyBindingsAccordingToConfig,
} from '@/config/keybindings';
import { StatusPanelContentWrapper } from '@/features/map_planning/components/statuspanel/StatusPanelContentWrapper';
import { useKeyHandlers } from '@/hooks/useKeyHandlers';
import { getNameFromPlant, getPlantNameFromSeedAndPlant } from '@/utils/plant-naming';
import useMapStore from '../../store/MapStore';
import { PlantForPlanting } from '../../store/MapStoreTypes';
import { useIsReadOnlyMode } from '../../utils/ReadOnlyModeContext';
import { useIsPlantLayerActive } from '../../utils/layer-utils';
import { isPlacementModeActive } from '../../utils/planting-utils';
import { CreatePlantAction, MovePlantAction, TransformPlantAction } from './actions';
import { AreaOfPlantingsIndicator } from './components/AreaOfPlantingsIndicator/AreaOfPlantingsIndicator';
import { PlantCursor } from './components/PlantCursor';
import { PlantLayerRelationsOverlay } from './components/PlantLayerRelationsOverlay';
import { Planting } from './components/Planting/Planting';
import { useDeleteSelectedPlantings } from './hooks/useDeleteSelectedPlantings';
import { calculatePlantCount, getPlantWidth } from './util';

function exitPlantingMode() {
  useMapStore.getState().selectPlantings(null);
}

type CreatePlantingArgs =
  | {
      isArea: false;
      selectedPlantForPlanting: PlantForPlanting;
      xCoordinate: number;
      yCoordinate: number;
    }
  | {
      isArea: true;
      selectedPlantForPlanting: PlantForPlanting;
      xCoordinate: number;
      yCoordinate: number;
      width: number;
      height: number;
    };

function usePlantLayerListeners(listening: boolean) {
  const executeAction = useMapStore((state) => state.executeAction);
  const selectedPlant = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantForPlanting,
  );
  const timelineDate = useMapStore((state) => state.untrackedState.timelineDate);
  const getSelectedLayerId = useMapStore((state) => state.getSelectedLayerId);
  const isReadOnlyMode = useIsReadOnlyMode();

  const createPlanting = useCallback(
    (args: CreatePlantingArgs) => {
      const data: Omit<ConstructorParameters<typeof CreatePlantAction>[0], 'width' | 'height'> = {
        id: uuid.v4(),
        plantId: args.selectedPlantForPlanting.plant.id,
        seedId: args.selectedPlantForPlanting.seed?.id,
        layerId: getSelectedLayerId() ?? -1,
        x: Math.round(args.xCoordinate),
        y: Math.round(args.yCoordinate),
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        addDate: timelineDate,
        additionalName: args.selectedPlantForPlanting.seed?.name,
        isArea: args.isArea,
      };

      if (args.isArea) {
        executeAction(
          new CreatePlantAction({
            ...data,
            width: Math.round(args.width),
            height: Math.round(args.height),
          }),
        );
      } else {
        executeAction(
          new CreatePlantAction({
            ...data,
            height: getPlantWidth(args.selectedPlantForPlanting.plant),
            width: getPlantWidth(args.selectedPlantForPlanting.plant),
          }),
        );
      }
    },
    [executeAction, getSelectedLayerId, timelineDate],
  );

  const drawPlantField = useCallback(
    (selectedPlantForPlanting: PlantForPlanting) => {
      const {
        width: fieldWidth,
        height: fieldHeight,
        x: fieldX,
        y: fieldY,
      } = useMapStore.getState().selectionRectAttributes;

      const plantSize = getPlantWidth(selectedPlantForPlanting.plant);
      const { horizontalPlantCount, verticalPlantCount } = calculatePlantCount(
        plantSize,
        fieldWidth,
        fieldHeight,
      );
      const totalPlantCount = horizontalPlantCount * verticalPlantCount;

      if (totalPlantCount > 1) {
        createPlanting({
          isArea: true,
          selectedPlantForPlanting,
          xCoordinate: fieldX,
          yCoordinate: fieldY,
          width: fieldWidth,
          height: fieldHeight,
        });
      }
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

      createPlanting({
        isArea: false,
        selectedPlantForPlanting: selectedPlant,
        xCoordinate: position.x,
        yCoordinate: position.y,
      });
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

  const plantings = useMapStore((map) => map.trackedState.layers.plants.objects);
  const selectedPlant = useMapStore(
    (state) => state.untrackedState.layers.plants.selectedPlantForPlanting,
  );

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
        {plantings.map((planting) => (
          <Planting planting={planting} key={planting.id} />
        ))}
      </Layer>
      <Layer listening={false}>
        <PlantCursor />
        <AreaOfPlantingsIndicator />
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
    <StatusPanelContentWrapper
      content={seed ? getPlantNameFromSeedAndPlant(seed, plant) : getNameFromPlant(plant)}
      onClose={() => selectPlant(null)}
    />
  );
}

export default PlantsLayer;
