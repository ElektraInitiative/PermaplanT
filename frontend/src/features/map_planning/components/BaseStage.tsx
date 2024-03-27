import { AnimatePresence, motion } from 'framer-motion';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import React, { useEffect, useRef, useState } from 'react';
import { Layer, Rect, Stage, Transformer } from 'react-konva';
import { useDimensions } from '@/hooks/useDimensions';
import { colors } from '@/utils/colors';
import { useSelectedLayerVisibility } from '../hooks/useSelectedLayerVisibility';
import useMapStore from '../store/MapStore';
import { useTransformerStore } from '../store/transformer/TransformerStore';
import { useIsReadOnlyMode } from '../utils/ReadOnlyModeContext';
import {
  SELECTION_RECTANGLE_NAME,
  hideSelectionRectangle,
  initializeSelectionRectangle,
  selectIntersectingShapes,
  updateSelectionRectangle,
} from '../utils/ShapesSelection';
import { handleScroll, handleZoom } from '../utils/StageTransform';
import { setTooltipPositionToMouseCursor } from '../utils/Tooltip';
import { isPlacementModeActive } from '../utils/planting-utils';
import { CursorTooltip } from './CursorTooltip';

export const TEST_IDS = Object.freeze({
  CANVAS: 'base-stage__canvas',
});

interface BaseStageProps {
  zoomable?: boolean;
  scrollable?: boolean;
  selectable?: boolean;
  draggable?: boolean;
  listeners?: {
    stageDragStartListeners: Map<string, (e: KonvaEventObject<DragEvent>) => void>;
    stageDragEndListeners: Map<string, (e: KonvaEventObject<DragEvent>) => void>;
    stageMouseMoveListeners: Map<string, (e: KonvaEventObject<MouseEvent>) => void>;
    stageMouseWheelListeners: Map<string, (e: KonvaEventObject<MouseEvent>) => void>;
    stageMouseDownListeners: Map<string, (e: KonvaEventObject<MouseEvent>) => void>;
    stageMouseUpListeners: Map<string, (e: KonvaEventObject<MouseEvent>) => void>;
    stageClickListeners: Map<string, (e: KonvaEventObject<MouseEvent>) => void>;
  };
  children: React.ReactNode;
}

/**
 * This component is responsible for rendering the base stage that the user is going to draw on.
 *
 * It supports the following features out of the box and are enabled by default:
 *  - Zooming
 *  - Scrolling
 *  - Select & Multi-Select
 *  - Dragging
 */
export const BaseStage = ({
  children,
  zoomable = true,
  scrollable = true,
  selectable = true,
  draggable = true,
  listeners,
}: BaseStageProps) => {
  // Represents the state of the stage
  const [stage, setStage] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

  // Represents the state of the current selection rectangle
  const selectionRectAttrs = useMapStore((store) => store.selectionRectAttributes);
  const setSelectionRectAttrs = useMapStore((store) => store.updateSelectionRect);
  const transformerActions = useTransformerStore((store) => store.actions);

  const transformerRef = useRef<Konva.Transformer>(null);
  useEffect(() => {
    useTransformerStore.getState().actions.initialize(transformerRef);
  }, [transformerRef]);

  // https://konvajs.org/docs/react/Access_Konva_Nodes.html
  const stageRef = useRef<Konva.Stage>(null);
  useEffect(() => {
    useMapStore.setState({ stageRef: stageRef });
  }, [stageRef]);

  const tooltipRef = useRef<Konva.Label>(null);
  useEffect(() => {
    useMapStore.setState({ tooltipRef: tooltipRef });
  }, [tooltipRef]);

  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);

  const { isSelectedLayerVisible } = useSelectedLayerVisibility();

  const updateViewRect = useMapStore((store) => store.updateViewRect);
  const viewRect = useMapStore((store) => store.untrackedState.editorViewRect);
  useEffect(() => {
    if (viewRect.width !== 0 || viewRect.height !== 0) return;
    updateViewRect({
      x: 0,
      y: 0,
      width: Math.floor(window.innerWidth / stage.scale),
      height: Math.floor(window.innerHeight / stage.scale),
    });
  });

  const onStageWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    listeners?.stageMouseWheelListeners.forEach((listener) => listener(e));

    const targetStage = getStageByEventTarget(e);
    if (targetStage === null) return;

    if (tooltipRef.current) {
      setTooltipPositionToMouseCursor();
    }

    const pointerVector = targetStage.getPointerPosition();
    if (pointerVector === null) return;

    if (e.evt.ctrlKey) {
      if (zoomable) {
        handleZoom(pointerVector, e.evt.deltaY, targetStage, setStage);
      }
    } else {
      if (scrollable) {
        handleScroll(e.evt.deltaX, e.evt.deltaY, targetStage);
      }
    }

    if (stageRef.current === null) return;

    updateViewRect({
      x: Math.floor(stageRef.current.getAbsolutePosition().x / stage.scale),
      y: Math.floor(stageRef.current.getAbsolutePosition().y / stage.scale),
      width: Math.floor(window.innerWidth / stage.scale),
      height: Math.floor(window.innerHeight / stage.scale),
    });
  };

  // Event listener responsible for allowing stage-dragging only via middle mouse button
  // and for preventing dragging of non-selected nodes
  const onStageDragStart = (e: KonvaEventObject<DragEvent>) => {
    listeners?.stageDragStartListeners.forEach((listener) => listener(e));
    renderGrabbingMouseCursor();
    if (!e.evt) return;

    if (!isUsingMiddleMouseButton(e)) {
      preventStageDragging(e);
    }

    preventDraggingOfNonSelectedShapes(e);
  };

  const onStageDragEnd = (e: KonvaEventObject<DragEvent>) => {
    listeners?.stageDragEndListeners.forEach((listener) => listener(e));
    if (stageRef.current === null) return;

    updateViewRect({
      x: Math.floor(stageRef.current.getAbsolutePosition().x / stage.scale),
      y: Math.floor(stageRef.current.getAbsolutePosition().y / stage.scale),
      width: Math.floor(window.innerWidth / stage.scale),
      height: Math.floor(window.innerHeight / stage.scale),
    });
  };

  // Event listener responsible for updating the selection rectangle's size
  // and subsequently selecting all intersecting shapes
  const onStageMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    listeners?.stageMouseMoveListeners.forEach((listener) => listener(e));
    const stage = getStageByEventTarget(e);
    if (!stage || !selectionRectAttrs.isVisible || !selectable) return;

    updateSelectionRectangle(stage, setSelectionRectAttrs);

    if (!isPlacementModeActive()) {
      selectIntersectingShapes(stageRef, transformerRef);
    }
  };

  // Event listener responsible for initializing the stage-dragging mode via middle mouse button
  // and for positioning the selection rectangle at the current mouse position
  const onStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    listeners?.stageMouseDownListeners.forEach((listener) => listener(e));
    const shouldAllowSelectionOnCurrentLayer = () => {
      const isStageSelectable = selectable;

      // this enables dragging the whole transformer and not just the currently targeted shape
      if (e.target instanceof Konva.Shape) {
        return false;
      }
      return isStageSelectable && isSelectedLayerVisible;
    };

    const resetCurrentPlantingsSelection = () => {
      useMapStore.getState().selectPlantings(null);
    };

    const stage = getStageByEventTarget(e);
    if (!stage) return;

    if (isUsingMiddleMouseButton(e)) {
      initializeStageDraggingMode(e, stage);
      return;
    }

    if (shouldAllowSelectionOnCurrentLayer()) {
      if (!isPlacementModeActive()) {
        resetCurrentPlantingsSelection();
      }
      initializeSelectionRectangle(stage, setSelectionRectAttrs);
    }
  };

  // Event listener responsible for stopping a possible stage-dragging mode
  // and for hiding the selection rectangle
  const onStageMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    renderDefaultMouseCursor();

    stopStageDraggingMode(e);

    if (selectable) {
      hideSelectionRectangle(setSelectionRectAttrs, selectionRectAttrs);
    }
  };

  // Event listener responsible for resetting the current selection of shapes when clicking on stage
  const onStageClick = (e: KonvaEventObject<MouseEvent>) => {
    listeners?.stageClickListeners.forEach((listener) => listener(e));
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

    if (transformerActions.hasSelection() && isEventTriggeredFromStage(e)) {
      transformerActions.clearSelection();
    }
  };

  const isReadOnly = useIsReadOnlyMode();

  const bottomStatusPanelContent = useMapStore(
    (map) => map.untrackedState.bottomStatusPanelContent,
  );

  return (
    <div className="h-full w-full overflow-hidden" data-testid={TEST_IDS.CANVAS} ref={containerRef}>
      <Stage
        ref={stageRef}
        draggable={draggable}
        width={dimensions.width}
        height={dimensions.height}
        onWheel={onStageWheel}
        onDragStart={onStageDragStart}
        onDragEnd={onStageDragEnd}
        onMouseDown={onStageMouseDown}
        onMouseMove={onStageMouseMove}
        onMouseUp={onStageMouseUp}
        onClick={onStageClick}
        scaleX={stage.scale}
        scaleY={stage.scale}
        x={stage.x}
        y={stage.y}
      >
        {children}
        <Layer>
          <CursorTooltip />
          <Rect
            x={selectionRectAttrs.x}
            y={selectionRectAttrs.y}
            width={selectionRectAttrs.width}
            height={selectionRectAttrs.height}
            fill={colors.secondary[500]}
            visible={selectionRectAttrs.isVisible}
            opacity={0.2}
            name={SELECTION_RECTANGLE_NAME}
          />
          <Transformer // DO NOT CONDITIONALLY RENDER THIS COMPONENT
            listening={!isReadOnly}
            // We need to manually disable selection when we are transforming
            onTransformStart={() => {
              selectable = false;
            }}
            onTransformEnd={() => {
              selectable = true;
            }}
            onMouseDown={() => {
              selectable = false;
            }}
            onMouseUp={() => {
              selectable = true;
            }}
            ref={transformerRef}
            name="transformer"
            anchorSize={8}
          />
        </Layer>
      </Stage>
      {/** Panel to display something from different layers */}
      <div className="absolute bottom-36 left-1/2 z-10 -translate-x-1/2">
        <AnimatePresence mode="wait">
          {bottomStatusPanelContent && (
            <BottomStatusPanel>{bottomStatusPanelContent}</BottomStatusPanel>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

function renderGrabbingMouseCursor(): void {
  document.body.style.cursor = 'grabbing';
}

function renderDefaultMouseCursor(): void {
  document.body.style.cursor = 'default';
}

function getStageByEventTarget(konvaEvent: KonvaEventObject<MouseEvent>): Konva.Stage | null {
  return konvaEvent.target.getStage();
}

function isUsingMiddleMouseButton(konvaEvent: KonvaEventObject<MouseEvent>): boolean {
  return konvaEvent.evt?.buttons === 4;
}

function isEventTriggeredFromStage(konvaEvent: KonvaEventObject<MouseEvent>): boolean {
  return konvaEvent.target instanceof Konva.Stage;
}

function preventStageDragging(konvaEvent: KonvaEventObject<DragEvent>): void {
  const stage = getStageByEventTarget(konvaEvent);
  if (!stage) return;

  if (konvaEvent.target === stage) {
    stage.stopDrag();
  }
}

function preventDraggingOfNonSelectedShapes(konvaEvent: KonvaEventObject<DragEvent>): void {
  if (
    !konvaEvent.target.attrs.isControlElement &&
    !useTransformerStore.getState().actions.isNodeSelected(konvaEvent.target)
  ) {
    konvaEvent.target.stopDrag();
  }
}

function initializeStageDraggingMode(
  konvaEvent: KonvaEventObject<MouseEvent>,
  stage: Konva.Stage,
): void {
  if (!isEventTriggeredFromStage(konvaEvent)) {
    // this adds immediate (i.e. without delay) dragging prevention of any non-stage node
    konvaEvent.target.stopDrag();
  }

  stage.startDrag();
}

function stopStageDraggingMode(konvaEvent: KonvaEventObject<MouseEvent>): void {
  const stage = getStageByEventTarget(konvaEvent);
  if (!stage) return;

  // this prevents automatic stage-dragging after releasing middle mouse button without
  // having dragged at all yet, i.e. we are still in dragging mode
  if (stage.isDragging()) {
    stage.stopDrag();
  }
}

function BottomStatusPanel(props: React.PropsWithChildren) {
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
      {props.children}
    </motion.div>
  );
}
