import i18next from 'i18next';
import Konva from 'konva';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layer } from 'react-konva';
import { ShepherdTourContext } from 'react-shepherd';
import { toast } from 'react-toastify';
import { GainedBlossomsDto, LayerDto, LayerType } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import CancelConfirmationModal from '@/components/Modals/ExtendedModal';
import {
  KEYBINDINGS_SCOPE_GLOBAL,
  createKeyBindingsAccordingToConfig,
  useGetFormattedKeybindingDescriptionForAction,
} from '@/config/keybindings';
import { FrontendOnlyLayerType } from '@/features/map_planning/layers/_frontend_only';
import { GridLayer } from '@/features/map_planning/layers/_frontend_only/grid/GridLayer';
import DrawingLayer from '@/features/map_planning/layers/drawing/DrawingLayer';
import { DrawingLayerLeftToolbar } from '@/features/map_planning/layers/drawing/DrawingLayerLeftToolbar';
import DrawingLayerRightToolbar from '@/features/map_planning/layers/drawing/DrawingLayerRightToolbar';
import { CombinedLayerType } from '@/features/map_planning/store/MapStoreTypes';
import { StageListenerRegister } from '@/features/map_planning/types/layer-config';
import { useKeyHandlers } from '@/hooks/useKeyHandlers';
import CheckIcon from '@/svg/icons/check.svg?react';
import CircleDottedIcon from '@/svg/icons/circle-dotted.svg?react';
import GridIcon from '@/svg/icons/grid-dots.svg?react';
import RedoIcon from '@/svg/icons/redo.svg?react';
import TagsIcon from '@/svg/icons/tags.svg?react';
import UndoIcon from '@/svg/icons/undo.svg?react';
import { gainBlossom } from '../api/gainBlossom';
import { useCompleteTour, useReenableTour } from '../hooks/tourHookApi';
import BaseLayer from '../layers/base/BaseLayer';
import BaseLayerRightToolbar from '../layers/base/components/BaseLayerRightToolbar';
import PlantsLayer from '../layers/plant/PlantsLayer';
import { PlantLayerLeftToolbar } from '../layers/plant/components/PlantLayerLeftToolbar';
import { PlantLayerRightToolbar } from '../layers/plant/components/PlantLayerRightToolbar';
import useMapStore from '../store/MapStore';
import { useIsReadOnlyMode } from '../utils/ReadOnlyModeContext';
import { convertToDate } from '../utils/date-utils';
import { BaseStage } from './BaseStage';
import TimelineDatePicker from './timeline/TimelineDatePicker';
import { LayerList } from './toolbar/LayerList';
import { Toolbar } from './toolbar/Toolbar';

import KonvaEventObject = Konva.KonvaEventObject;

export const TEST_IDS = Object.freeze({
  UNDO_BUTTON: 'map__undo-button',
  REDO_BUTTON: 'map__redo-button',
});

export type MapProps = {
  layers: LayerDto[];
};

/**
 * This component is responsible for rendering the map that the user is going to draw on.
 * In order to add a new layer you can add another layer file under the "layers" folder.
 * Features such as zooming and panning are handled by the BaseStage component.
 * You only have to make sure that every shape has the property "draggable" set to true.
 * Otherwise, they cannot be moved.
 */
export const EditorMap = ({ layers }: MapProps) => {
  const layersState = useMapStore((map) => map.untrackedState.layers);
  const canUndo = useMapStore((map) => map.canUndo);
  const canRedo = useMapStore((map) => map.canRedo);
  const undo = useMapStore((map) => map.undo);
  const redo = useMapStore((map) => map.redo);
  const updateLayerVisible = useMapStore((map) => map.updateLayerVisible);
  const toggleShowPlantLabel = useMapStore((map) => map.toggleShowPlantLabel);
  const getSelectedLayerType = useMapStore((map) => map.getSelectedLayerType);
  const timelineDate = useMapStore((state) => state.untrackedState.timelineDate);
  const updateTimelineDate = useMapStore((state) => state.updateTimelineDate);
  const tour = useContext(ShepherdTourContext);
  const { t } = useTranslation(['timeline', 'blossoms', 'common', 'guidedTour', 'toolboxTooltips']);
  const isReadOnlyMode = useIsReadOnlyMode();
  const [show, setShow] = useState(false);
  const [timeLineState, setTimeLineState] = useState<'loading' | 'idle'>('idle');

  const { mutate: reenableTour } = useReenableTour();
  const { mutate: completeTour } = useCompleteTour();
  const isShapeSelectionEnabled = useMapStore(
    (state) => state.untrackedState.shapeSelectionEnabled,
  );

  // Allow layers to listen for all events on the base stage.
  //
  // This enables us to build layers with custom input logic that does not
  // rely on Konva's limited Canvas-Object controls.
  const [stageDragStartListeners, setStageDragStartListeners] = useState<
    Map<string, (e: KonvaEventObject<DragEvent>) => void>
  >(new Map());
  const [stageDragEndListeners, setStageDragEndListeners] = useState<
    Map<string, (e: KonvaEventObject<DragEvent>) => void>
  >(new Map());
  const [stageMouseMoveListeners, setStageMouseMoveListeners] = useState<
    Map<string, (e: KonvaEventObject<MouseEvent>) => void>
  >(new Map());
  const [stageMouseWheelListeners, setStageMouseWheelListeners] = useState<
    Map<string, (e: KonvaEventObject<MouseEvent>) => void>
  >(new Map());
  const [stageMouseUpListeners, setStageMouseUpListeners] = useState<
    Map<string, (e: KonvaEventObject<MouseEvent>) => void>
  >(new Map());
  const [stageMouseDownListeners, setStageMouseDownListeners] = useState<
    Map<string, (e: KonvaEventObject<MouseEvent>) => void>
  >(new Map());
  const [stageClickListeners, setStageClickListeners] = useState<
    Map<string, (e: KonvaEventObject<MouseEvent>) => void>
  >(new Map());

  const baseStageListenerRegister: StageListenerRegister = {
    registerStageDragStartListener: (
      key: string,
      listener: (e: KonvaEventObject<DragEvent>) => void,
    ) => {
      setStageDragStartListeners((listeners) => listeners.set(key, listener));
    },
    registerStageDragEndListener: (
      key: string,
      listener: (e: KonvaEventObject<DragEvent>) => void,
    ) => {
      setStageDragEndListeners((listeners) => listeners.set(key, listener));
    },
    registerStageMouseMoveListener: (
      key: string,
      listener: (e: KonvaEventObject<MouseEvent>) => void,
    ) => {
      setStageMouseMoveListeners((listeners) => listeners.set(key, listener));
    },
    registerStageMouseWheelListener: (
      key: string,
      listener: (e: KonvaEventObject<MouseEvent>) => void,
    ) => {
      setStageMouseWheelListeners((listeners) => listeners.set(key, listener));
    },
    registerStageMouseDownListener: (
      key: string,
      listener: (e: KonvaEventObject<MouseEvent>) => void,
    ) => {
      setStageMouseDownListeners((listeners) => listeners.set(key, listener));
    },
    registerStageMouseUpListener: (
      key: string,
      listener: (e: KonvaEventObject<MouseEvent>) => void,
    ) => {
      setStageMouseUpListeners((listeners) => listeners.set(key, listener));
    },
    registerStageClickListener: (
      key: string,
      listener: (e: KonvaEventObject<MouseEvent>) => void,
    ) => {
      setStageClickListeners((listeners) => listeners.set(key, listener));
    },
  };

  const isGridLayerEnabled = () => {
    return layersState.grid.visible;
  };

  const isPlantLabelTooltipEnabled = () => {
    return layersState.plants.showLabels;
  };

  function triggerDateChangedInGuidedTour(): void {
    const changeDateEvent = new Event('dateChanged');
    document.getElementById('timeline')?.dispatchEvent(changeDateEvent);
  }

  useEffect(() => {
    const _tourCompletionBlossom = async () => {
      const blossom: GainedBlossomsDto = {
        blossom: 'graduation_day',
        times_gained: 1,
        gained_date: new Date().toISOString().split('T')[0],
      };
      await gainBlossom(blossom);
      toast.success(`${t('blossoms:blossom_gained')} ${t('blossoms:types.graduation_day')}`, {
        icon: '\u{1F338}',
      });
    };

    tour?.start();
    if (tour && tour.steps.length > 0) {
      tour?.on('cancel', () => {
        setShow(true);
      });
      tour?.on('complete', () => {
        _tourCompletionBlossom();
        completeTour();
      });
    }

    return () => tour?.hide();
  }, [completeTour, tour, t]);

  const handleTimeLineDateChanged = useCallback(
    (date: string) => {
      triggerDateChangedInGuidedTour();
      setTimeLineState('idle');
      updateTimelineDate(date);
    },
    [updateTimelineDate],
  );

  const handleTimeLineLoading = useCallback(() => {
    setTimeLineState('loading');
  }, []);

  const getToolbarContent = (layerType: CombinedLayerType) => {
    const content = {
      [LayerType.Base]: {
        left: <div></div>,
        right: <BaseLayerRightToolbar />,
      },
      [LayerType.Plants]: { left: <PlantLayerLeftToolbar />, right: <PlantLayerRightToolbar /> },
      [LayerType.Drawing]: {
        left: <DrawingLayerLeftToolbar />,
        right: <DrawingLayerRightToolbar />,
      },
      [LayerType.Fertilization]: { left: <div></div>, right: <div></div> },
      [LayerType.Habitats]: { left: <div></div>, right: <div></div> },
      [LayerType.Hydrology]: { left: <div></div>, right: <div></div> },
      [LayerType.Infrastructure]: { left: <div></div>, right: <div></div> },
      [LayerType.Label]: { left: <div></div>, right: <div></div> },
      [LayerType.Landscape]: { left: <div></div>, right: <div></div> },
      [LayerType.Paths]: { left: <div></div>, right: <div></div> },
      [LayerType.Shade]: { left: <div></div>, right: <div></div> },
      [LayerType.Soil]: { left: <div></div>, right: <div></div> },
      [LayerType.Terrain]: { left: <div></div>, right: <div></div> },
      [LayerType.Trees]: { left: <div></div>, right: <div></div> },
      [LayerType.Warnings]: { left: <div></div>, right: <div></div> },
      [LayerType.Winds]: { left: <div></div>, right: <div></div> },
      [LayerType.Zones]: { left: <div></div>, right: <div></div> },
      [LayerType.Todo]: { left: <div></div>, right: <div></div> },
      [LayerType.Photo]: { left: <div></div>, right: <div></div> },
      [LayerType.Watering]: { left: <div></div>, right: <div></div> },
      [FrontendOnlyLayerType.Grid]: { left: <div></div>, right: <div></div> },
    };

    return content[layerType];
  };

  const keyHandlerActions: Record<string, () => void> = {
    undo: undo,
    redo: redo,
  };

  const keybindings = createKeyBindingsAccordingToConfig(
    KEYBINDINGS_SCOPE_GLOBAL,
    keyHandlerActions,
  );

  useKeyHandlers(keybindings, document, true, true);

  return (
    <>
      <div className="flex h-full justify-between">
        <section className="min-h-full bg-neutral-100 dark:bg-neutral-200-dark">
          <Toolbar
            minWidth={160}
            contentTop={
              <div>
                <IconButton
                  isToolboxIcon={true}
                  className={`${!canUndo ? 'opacity-50' : ''}`}
                  disabled={isReadOnlyMode || !canUndo}
                  onClick={() => undo()}
                  title={useGetFormattedKeybindingDescriptionForAction(
                    KEYBINDINGS_SCOPE_GLOBAL,
                    'undo',
                    t('toolboxTooltips:undo'),
                  )}
                  data-tourid="undo"
                  data-testid={TEST_IDS.UNDO_BUTTON}
                >
                  <UndoIcon></UndoIcon>
                </IconButton>
                <IconButton
                  isToolboxIcon={true}
                  className={`${!canRedo ? 'opacity-50' : ''}`}
                  disabled={isReadOnlyMode || !canRedo}
                  onClick={() => redo()}
                  title={useGetFormattedKeybindingDescriptionForAction(
                    KEYBINDINGS_SCOPE_GLOBAL,
                    'redo',
                    t('toolboxTooltips:redo'),
                  )}
                  data-testid={TEST_IDS.REDO_BUTTON}
                >
                  <RedoIcon></RedoIcon>
                </IconButton>
                <IconButton
                  isToolboxIcon={true}
                  renderAsActive={isGridLayerEnabled()}
                  onClick={() =>
                    updateLayerVisible(FrontendOnlyLayerType.Grid, !layersState.grid.visible)
                  }
                  title={t('toolboxTooltips:grid')}
                >
                  <GridIcon></GridIcon>
                </IconButton>
                <IconButton
                  isToolboxIcon={true}
                  renderAsActive={isPlantLabelTooltipEnabled()}
                  onClick={() => toggleShowPlantLabel()}
                  title={t('toolboxTooltips:plant_labels')}
                >
                  <TagsIcon></TagsIcon>
                </IconButton>
              </div>
            }
            contentBottom={getToolbarContent(getSelectedLayerType()).left}
            position="left"
          ></Toolbar>
        </section>
        <section
          className="flex h-full w-full flex-col overflow-hidden"
          data-tourid="canvas"
          id="canvas"
          tabIndex={0} //so that map can be focused
        >
          <BaseStage
            listeners={{
              stageDragStartListeners,
              stageDragEndListeners,
              stageMouseMoveListeners,
              stageMouseUpListeners,
              stageMouseDownListeners,
              stageMouseWheelListeners,
              stageClickListeners,
            }}
            selectable={isShapeSelectionEnabled}
          >
            <Layer listening={true}>
              <BaseLayer
                stageListenerRegister={baseStageListenerRegister}
                opacity={layersState.base.opacity}
                visible={layersState.base.visible}
                listening={getSelectedLayerType() === LayerType.Base}
              />
              <DrawingLayer
                visible={layersState.drawing.visible}
                opacity={layersState.drawing.opacity}
                listening={getSelectedLayerType() === LayerType.Drawing}
              ></DrawingLayer>
              <PlantsLayer
                visible={layersState.plants.visible}
                opacity={layersState.plants.opacity}
                listening={getSelectedLayerType() === LayerType.Plants}
              ></PlantsLayer>
              <GridLayer
                visible={layersState.grid.visible}
                opacity={layersState.grid.opacity}
              ></GridLayer>
            </Layer>
          </BaseStage>
          <div>
            <TimelineDatePicker
              onSelectDate={handleTimeLineDateChanged}
              onLoading={handleTimeLineLoading}
              defaultDate={timelineDate}
            />
          </div>
        </section>
        <section className="min-h-full bg-neutral-100 dark:bg-neutral-200-dark">
          <Toolbar
            contentTop={<LayerList layers={layers} />}
            contentBottom={getToolbarContent(getSelectedLayerType()).right}
            position="right"
            minWidth={200}
            fixedContentBottom={
              <div className="mb-0 mt-auto flex border-t-2 border-neutral-700 p-2 tracking-wide">
                {t('timeline:map_date')}
                {convertToDate(timelineDate).toLocaleDateString(i18next.resolvedLanguage, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                })}
                {timeLineState === 'loading' && (
                  <CircleDottedIcon className="mb-3 ml-2 mt-auto h-5 w-5 animate-spin text-secondary-400" />
                )}
                {timeLineState === 'idle' && (
                  <CheckIcon
                    className="mb-3 ml-2 mt-auto h-5 w-5 text-primary-400"
                    data-testid="timeline__state-idle"
                  />
                )}
              </div>
            }
          ></Toolbar>
        </section>
      </div>
      <CancelConfirmationModal
        title={t('guidedTour:skip_title')}
        body={t('guidedTour:skip_text')}
        show={show}
        cancelBtnTitle={t('guidedTour:confirmation_resume')}
        onCancel={() => {
          const currentStep = tour?.getCurrentStep()?.id;
          tour?.start();
          tour?.show(currentStep);
          reenableTour();
          setShow(false);
        }}
        firstActionBtnTitle={t('guidedTour:confirmation_pause')}
        onFirstAction={() => {
          reenableTour();
          setShow(false);
        }}
        secondActionBtnTitle={t('guidedTour:confirmation_quit')}
        onSecondAction={() => {
          tour?.complete();
          setShow(false);
        }}
      />
    </>
  );
};
