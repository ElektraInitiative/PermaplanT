import { useSelectedLayerVisibility } from '../hooks/useSelectedLayerVisibility';
import useMapStore from '../store/MapStore';
import { SelectionRectAttrs } from '../types/SelectionRectAttrs';
import { MapLabel } from '../utils/MapLabel';
import { useIsReadOnlyMode } from '../utils/ReadOnlyModeContext';
import {
  hideSelectionRectangle,
  initializeSelectionRectangle,
  isUsingModiferKey,
  resetTransformerSelection,
  selectIntersectingShapes,
  updatePreviousTransformerSelection,
  updateSelectionRectangle,
} from '../utils/ShapesSelection';
import { handleScroll, handleZoom } from '../utils/StageTransform';
import { setTooltipPositionToMouseCursor } from '../utils/Tooltip';
import { isPlacementModeActive } from '../utils/planting-utils';
import { useDimensions } from '@/hooks/useDimensions';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useRef, useState } from 'react';
import { Layer, Rect, Stage, Transformer } from 'react-konva';

export const TEST_IDS = Object.freeze({
  CANVAS: 'base-stage__canvas',
});

interface BaseStageProps {
  zoomable?: boolean;
  scrollable?: boolean;
  selectable?: boolean;
  draggable?: boolean;
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
}: BaseStageProps) => {
  // Represents the state of the stage
  const [stage, setStage] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

  // Represents the state of the current selection rectangle
  const [selectionRectAttrs, setSelectionRectAttrs] = useState<SelectionRectAttrs>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    isVisible: false,
    boundingBox: {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    },
  });

  const transformerRef = useRef<Konva.Transformer>(null);
  useEffect(() => {
    useMapStore.setState({ transformer: transformerRef });
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

  const updateMapBounds = useMapStore((store) => store.updateMapBounds);
  const mapBounds = useMapStore((store) => store.untrackedState.editorBounds);
  useEffect(() => {
    if (mapBounds.width !== 0 || mapBounds.height !== 0) return;
    updateMapBounds({
      x: 0,
      y: 0,
      width: Math.floor(window.innerWidth / stage.scale),
      height: Math.floor(window.innerHeight / stage.scale),
    });
  });

  const tooltipContent = useMapStore((store) => store.untrackedState.tooltipContent);
  const tooltipPosition = useMapStore((state) => state.untrackedState.tooltipPosition);

  // Event listener responsible for allowing zooming with the ctrl key + mouse wheel
  const onStageWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

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

    updateMapBounds({
      x: Math.floor(stageRef.current.getAbsolutePosition().x / stage.scale),
      y: Math.floor(stageRef.current.getAbsolutePosition().y / stage.scale),
      width: Math.floor(window.innerWidth / stage.scale),
      height: Math.floor(window.innerHeight / stage.scale),
    });
  };

  // Event listener responsible for allowing stage-dragging only via middle mouse button
  // and for preventing dragging of non-selected nodes
  const onStageDragStart = (e: KonvaEventObject<DragEvent>) => {
    renderGrabbingMouseCursor();
    if (!e.evt) return;

    if (!isUsingMiddleMouseButton(e)) {
      preventStageDragging(e);
    }

    preventDraggingOfNonSelectedShapes(e);
  };

  const onStageDragEnd = () => {
    if (stageRef.current === null) return;

    updateMapBounds({
      x: Math.floor(stageRef.current.getAbsolutePosition().x / stage.scale),
      y: Math.floor(stageRef.current.getAbsolutePosition().y / stage.scale),
      width: Math.floor(window.innerWidth / stage.scale),
      height: Math.floor(window.innerHeight / stage.scale),
    });
  };

  // Event listener responsible for updating the selection rectangle's size
  // and subsequently selecting all intersecting shapes
  const onStageMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const stage = getStageByEventTarget(e);
    if (!stage || !selectionRectAttrs.isVisible || !selectable) return;

    updateSelectionRectangle(stage, setSelectionRectAttrs);
    selectIntersectingShapes(stageRef, transformerRef, e);
  };

  // Event listener responsible for initializing the stage-dragging mode via middle mouse button
  // and for positioning the selection rectangle at the current mouse position
  const onStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const shouldAllowSelectionOnCurrentLayer = () => {
      const isStageSelectable = selectable;

      // this enables dragging the whole transformer and not just the currently targeted shape
      if (e.target instanceof Konva.Shape) {
        return false;
      }

      if (isPlacementModeActive()) {
        return false;
      }

      return isStageSelectable && isSelectedLayerVisible;
    };

    const stage = getStageByEventTarget(e);
    if (!stage) return;

    if (isUsingMiddleMouseButton(e)) {
      initializeStageDraggingMode(e, stage);
      return;
    }

    if (shouldAllowSelectionOnCurrentLayer()) {
      if (!isUsingModiferKey(e)) {
        resetAnySelections(transformerRef);
      }
      initializeSelectionRectangle(stage, setSelectionRectAttrs);
    }
  };

  // Event listener responsible for stopping a possible stage-dragging mode
  // and for hiding the selection rectangle
  const onStageMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    renderDefaultMouseCursor();

    stopStageDraggingMode(e);
    updatePreviousTransformerSelection(transformerRef);

    if (transformerRef.current?.nodes().length === 0) {
      useMapStore.getState().selectPlantings(null);
    }

    if (selectable) {
      hideSelectionRectangle(setSelectionRectAttrs, selectionRectAttrs);
    }
  };

  // Event listener responsible for resetting the current selection of shapes when clicking on stage
  const onStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

    const nodeSize = transformerRef.current?.getNodes().length ?? 0;

    if (nodeSize > 0 && isEventTriggeredFromStage(e) && !isUsingModiferKey(e)) {
      resetTransformerSelection(transformerRef);
    }
  };

  const isReadOnly = useIsReadOnlyMode();

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
          {/* Tooltip */}
          <MapLabel
            content={tooltipContent}
            visible={tooltipContent !== ''}
            scaleX={2 / stage.scale}
            scaleY={2 / stage.scale}
            x={tooltipPosition.x}
            y={tooltipPosition.y}
          />
          <Rect
            x={selectionRectAttrs.x}
            y={selectionRectAttrs.y}
            width={selectionRectAttrs.width}
            height={selectionRectAttrs.height}
            fill={'blue'}
            visible={selectionRectAttrs.isVisible}
            opacity={0.2}
            name="selectionRect"
          />
          <Transformer
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
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          />
        </Layer>
      </Stage>
      {/** Portal to display something from different layers */}
      <div className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2">
        <div id="bottom-portal" />
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
  if (!transformerContainsNode(konvaEvent.target)) {
    konvaEvent.target.stopDrag();
  }
}

function transformerContainsNode(konvaNode: Konva.Stage | Konva.Shape): boolean {
  const currentTransformerNodes = useMapStore.getState().transformer.current?.nodes() ?? [];
  return currentTransformerNodes.includes(konvaNode);
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

function resetAnySelections(transformerRef: React.RefObject<Konva.Transformer>) {
  useMapStore.getState().selectPlantings(null);
  resetTransformerSelection(transformerRef);
  updatePreviousTransformerSelection(transformerRef);
}
