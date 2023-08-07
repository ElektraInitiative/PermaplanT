import useMapStore from '../store/MapStore';
import { SelectionRectAttrs } from '../types/SelectionRectAttrs';
import { MapLabel } from '../utils/MapLabel';
import {
  deselectShapes,
  endSelection,
  selectIntersectingShapes,
  startSelection,
  updateSelection,
} from '../utils/ShapesSelection';
import { handleScroll, handleZoom } from '../utils/StageTransform';
import { setTooltipPositionToMouseCursor } from '../utils/Tooltip';
import { useDimensions } from '@/hooks/useDimensions';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useRef, useState } from 'react';
import { Layer, Stage, Transformer } from 'react-konva';

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

  // Ref to the transformer
  const trRef = useRef<Konva.Transformer>(null);
  useEffect(() => {
    useMapStore.setState({ transformer: trRef });
  }, [trRef]);

  // https://konvajs.org/docs/react/Access_Konva_Nodes.html
  // Ref to the stage
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

    const targetStage = e.target.getStage();
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

  // Event listener responsible for allowing dragging of the stage only with the wheel mouse button
  const onStageDragStart = (e: KonvaEventObject<DragEvent>) => {
    if (e.evt === null || e.evt === undefined) return;
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (stage === null) return;

    // If the mouse pointer is starting the drag on an element that is not a stage then we don't drag
    // It works for now but there should be a better way since it's a bit wonky
    // Should work better with .draggable(false)
    if (e.evt.buttons) {
      if (e.evt.buttons !== 4 && e.target === stage) {
        stage.stopDrag();
      }
      if (e.evt.buttons === 4 && e.target !== stage) {
        stage.stopDrag();
      }
    }
  };

  const onStageDragEnd = (e: KonvaEventObject<DragEvent>) => {
    if (e.evt === null || e.evt === undefined) return;
    e.evt.preventDefault();

    if (stageRef.current === null) return;

    updateMapBounds({
      x: Math.floor(stageRef.current.getAbsolutePosition().x / stage.scale),
      y: Math.floor(stageRef.current.getAbsolutePosition().y / stage.scale),
      width: Math.floor(window.innerWidth / stage.scale),
      height: Math.floor(window.innerHeight / stage.scale),
    });
  };

  // Event listener responsible for updating the selection rectangle
  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    if (e.evt.buttons === 4) return;

    if (e.evt.buttons !== 4) {
      document.body.style.cursor = 'default';
    }

    const stage = e.target.getStage();
    if (stage === null || !selectionRectAttrs.isVisible || !selectable) return;

    updateSelection(stage, setSelectionRectAttrs);
    selectIntersectingShapes(stageRef, trRef);
  };

  // Event listener responsible for positioning the selection rectangle to the current mouse position
  const onStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    if (e.evt.buttons === 4) {
      document.body.style.cursor = 'grabbing';
    }

    const stage = e.target.getStage();
    if (stage == null || !selectable) return;

    startSelection(stage, setSelectionRectAttrs);
  };

  // Event listener responsible for ending the selection rectangle
  const onStageMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    if (!selectable) return;
    endSelection(setSelectionRectAttrs, selectionRectAttrs);
  };

  // Event listener responsible for unselecting shapes when clicking on the stage
  const onStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

    const isStage = e.target instanceof Konva.Stage;
    const nodeSize = trRef.current?.getNodes().length || 0;
    if (nodeSize > 0 && isStage) {
      deselectShapes(trRef);
    }
  };

  return (
    <div className="h-full w-full overflow-hidden" data-testid="canvas" ref={containerRef}>
      <Stage
        ref={stageRef}
        draggable={draggable}
        width={dimensions.width}
        height={dimensions.height}
        onWheel={onStageWheel}
        onDragEnd={onStageDragEnd}
        onDragStart={onStageDragStart}
        onMouseDown={onStageMouseDown}
        onMouseMove={onMouseMove}
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
          <Transformer
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
            ref={trRef}
            name="transformer"
            anchorSize={8}
            // shouldOverdrawWholeAre allows us to use the whole transformer area for dragging.
            // It's an experimental property so we should keep an eye out for possible issues
            shouldOverdrawWholeArea={true}
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
