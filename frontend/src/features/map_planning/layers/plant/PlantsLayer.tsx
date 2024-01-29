import { t } from 'i18next';
import Konva from 'konva';
import { KonvaEventListener, KonvaEventObject, Node } from 'konva/lib/Node';
import { useCallback, useEffect, useRef } from 'react';
import { Layer } from 'react-konva';
import * as uuid from 'uuid';
import {
  LayerType,
  MovePlantActionPayload,
  PlantingDto,
  PlantsSummaryDto,
  SeedDto,
  TransformPlantActionPayload,
} from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import {
  KEYBINDINGS_SCOPE_PLANTS_LAYER,
  createKeyBindingsAccordingToConfig,
  useGetFormattedKeybindingDescriptionForAction,
} from '@/config/keybindings';
import { useKeyHandlers } from '@/hooks/useKeyHandlers';
import CloseIcon from '@/svg/icons/close.svg?react';
import { PlantNameFromPlant, PlantNameFromSeedAndPlant } from '@/utils/plant-naming';
import useMapStore from '../../store/MapStore';
import { PlantForPlanting } from '../../store/MapStoreTypes';
import { useTransformerStore } from '../../store/transformer/TransformerStore';
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
      const data = {
        id: uuid.v4(),
        plantId: args.selectedPlantForPlanting.plant.id,
        seedId: args.selectedPlantForPlanting.seed?.id,
        layerId: getSelectedLayerId() ?? -1,
        x: Math.round(args.xCoordinate),
        y: Math.round(args.yCoordinate),
        rotation: 0,
        addDate: timelineDate,
        additionalName: args.selectedPlantForPlanting.seed?.name,
        isArea: args.isArea,
        // This `satisfies` gives us type safety while omitting the `sizeX` and `sizeY` properties
        // they get set later in this function
        modifiedAt: '',
        modifiedBy: '',
        createdAt: '',
        createdBy: '',
        plantingNotes: '',
      } satisfies Omit<
        ConstructorParameters<typeof CreatePlantAction>[0][number],
        'sizeX' | 'sizeY'
      >;

      if (args.isArea) {
        executeAction(
          new CreatePlantAction([
            {
              ...data,
              sizeX: Math.round(args.width),
              sizeY: Math.round(args.height),
            },
          ]),
        );
      } else {
        executeAction(
          new CreatePlantAction([
            {
              ...data,
              sizeX: getPlantWidth(args.selectedPlantForPlanting.plant),
              sizeY: getPlantWidth(args.selectedPlantForPlanting.plant),
            },
          ]),
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
      const { perRow: horizontalPlantCount, perColumn: verticalPlantCount } = calculatePlantCount(
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
   * selected for planting, creating an area of plantings inside the selection rectangle
   */
  const handleSelectPlanting: KonvaEventListener<Konva.Stage, MouseEvent> = useCallback(() => {
    if (isPlacementModeActive()) {
      const selectedPlantForPlanting =
        useMapStore.getState().untrackedState.layers.plants.selectedPlantForPlanting;

      drawPlantField(selectedPlantForPlanting as PlantForPlanting);
      return;
    }

    const plantings = useTransformerStore
      .getState()
      .actions.getSelection()
      .reduce(selectedPlantings, []);

    if (plantings?.length) {
      useMapStore.getState().selectPlantings(plantings, useTransformerStore.getState());
    }

    function selectedPlantings(foundPlantings: PlantingDto[], konvaNode: Node) {
      const plantingNode = konvaNode.getAttr('planting');

      return plantingNode ? [...foundPlantings, plantingNode] : [foundPlantings];
    }
  }, [drawPlantField]);

  /**
   * Event handler for transforming plants
   */
  const handleTransformPlanting: KonvaEventListener<Konva.Transformer, unknown> =
    useCallback(() => {
      const transformerActions = useTransformerStore.getState().actions;
      const nodes = transformerActions.getSelection();
      if (!nodes.length) {
        return;
      }

      const updates: TransformPlantActionPayload[] = nodes.map((node) => {
        const width = node.width() * node.scaleX();
        const height = node.height() * node.scaleY();
        // reset scale to 1 to avoid scaling the plant again when transforming it again
        // the transformers node is not the same as the plant node, so we need to reset the scale
        node.scaleX(1).scaleY(1);

        return {
          id: node.id(),
          x: Math.round(node.x()),
          y: Math.round(node.y()),
          sizeX: Math.round(width),
          sizeY: Math.round(height),
          rotation: node.rotation(),
        };
      });

      executeAction(new TransformPlantAction(updates));
    }, [executeAction]);

  /**
   * Event handler for moving plants
   */
  const handleMovePlanting: KonvaEventListener<Konva.Transformer, unknown> = useCallback(() => {
    const transformerActions = useTransformerStore.getState().actions;
    const nodes = transformerActions.getSelection();
    if (!nodes.length) {
      return;
    }

    const updates: MovePlantActionPayload[] = nodes.map((node) => {
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
    const transformerActions = useTransformerStore.getState().actions;
    useMapStore.getState().stageRef.current?.on('click.placePlant', handleCreatePlanting);
    useMapStore.getState().stageRef.current?.on('click.unselectPlanting', handleUnselectPlanting);
    useMapStore.getState().stageRef.current?.on('mouseup.selectPlanting', handleSelectPlanting);
    transformerActions.addEventListener('transformend.plants', handleTransformPlanting);
    transformerActions.addEventListener('dragend.plants', handleMovePlanting);

    return () => {
      useMapStore.getState().stageRef.current?.off('click.placePlant');
      useMapStore.getState().stageRef.current?.off('click.unselectPlanting');
      useMapStore.getState().stageRef.current?.off('mouseup.selectPlanting');
      transformerActions.removeEventListener('transformend.plants');
      transformerActions.removeEventListener('dragend.plants');
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
          title={useGetFormattedKeybindingDescriptionForAction(
            KEYBINDINGS_SCOPE_PLANTS_LAYER,
            'exitPlantingMode',
            t('common:cancel'),
          )}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </>
  );
}

export default PlantsLayer;
