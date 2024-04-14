import Konva from 'konva';
import { KonvaEventListener, KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Ellipse, Layer, Line, Rect } from 'react-konva';
import * as uuid from 'uuid';
import { DrawingDto, DrawingShapeType, LayerType } from '@/api_types/definitions';
import {
  KEYBINDINGS_SCOPE_DRAWING_LAYER,
  createKeyBindingsAccordingToConfig,
} from '@/config/keybindings';
import { useKeyHandlers } from '@/hooks/useKeyHandlers';
import useMapStore from '../../store/MapStore';
import { useTransformerStore } from '../../store/transformer/TransformerStore';
import { useIsDrawingLayerActive } from '../../utils/layer-utils';
import { CreateDrawingAction, UpdateDrawingAction } from './actions';
import { useDeleteSelectedDrawings } from './hooks/useDeleteSelectedDrawings';
import BezierPolygon from './shapes/BezierPolygon';
import { EllipseProperties, FreeLineProperties, RectangleProperties } from './types';

type DrawingLayerProps = Konva.LayerConfig & {
  layerId: number;
};

type Rectangle = {
  color: string;
  fillEnabled: boolean;
  strokeWidth: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type Ellipse = {
  fillEnabled: boolean;
  strokeWidth: number;
  color: string;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
};

type Line = {
  color: string;
  strokeWidth: number;
  fillEnabled: boolean;
  x: number;
  y: number;
  points: number[][];
};

function useDrawingLayerKeyListeners() {
  const { deleteSelectedDrawings } = useDeleteSelectedDrawings();
  const isDrawingLayerActive = useIsDrawingLayerActive();
  const keybindings = createKeyBindingsAccordingToConfig(KEYBINDINGS_SCOPE_DRAWING_LAYER, {
    deleteSelectedDrawings: () => {
      deleteSelectedDrawings();
    },
  });
  useKeyHandlers(isDrawingLayerActive ? keybindings : {});
}

function DrawingLayer(props: DrawingLayerProps) {
  const getSelectedLayerId = useMapStore((state) => state.getSelectedLayerId);
  const transformerActions = useTransformerStore((state) => state.actions);

  const selectedShape = useMapStore((state) => state.untrackedState.layers.drawing.selectedShape);
  const selectedColor = useMapStore((state) => state.untrackedState.layers.drawing.selectedColor);
  const selectedStrokeWidth = useMapStore(
    (state) => state.untrackedState.layers.drawing.selectedStrokeWidth,
  );
  const fillEnabled = useMapStore((state) => state.untrackedState.layers.drawing.fillEnabled);
  const isDrawingLayerActive = useIsDrawingLayerActive();

  const selectDrawings = useMapStore((state) => state.selectDrawings);
  useDrawingLayerKeyListeners();

  const { ...layerProps } = props;

  const drawingObjects = useMapStore((state) => state.trackedState.layers.drawing.objects).filter(
    (o) => o.layerId === props.layerId,
  );

  const rectangles = drawingObjects
    .filter((object) => object.shapeType === DrawingShapeType.Rectangle)
    .map((object) => {
      return {
        ...object,
        properties: object.properties as RectangleProperties,
      };
    });

  const ellipses = drawingObjects
    .filter((object) => object.shapeType === DrawingShapeType.Ellipse)
    .map((object) => {
      return {
        ...object,
        properties: object.properties as EllipseProperties,
      };
    });

  const lines = drawingObjects
    .filter((object) => object.shapeType === DrawingShapeType.FreeLine)
    .map((object) => {
      return {
        ...object,
        properties: object.properties as FreeLineProperties,
      };
    });

  const bezierLines = drawingObjects
    .filter((object) => object.shapeType === DrawingShapeType.BezierPolygon)
    .map((object) => {
      return {
        ...object,
        properties: object.properties as FreeLineProperties,
      };
    });

  const [newLine, setNewLine] = useState<Line>();
  const [newBezierLine, setNewBezierLine] = useState<Line>();

  const [previewRectangle, setPreviewRectangle] = useState<Rectangle | undefined>();
  const [previewEllipse, setPreviewEllipse] = useState<Ellipse | undefined>();

  const editMode = useMapStore((state) => state.untrackedState.layers.drawing.editMode);
  const editDrawingId = useMapStore((state) => state.untrackedState.layers.drawing.editDrawingId);

  const isDrawing = useRef(false);

  const timelineDate = useMapStore((state) => state.untrackedState.timelineDate);
  const executeAction = useMapStore((state) => state.executeAction);

  const isShapeSelected = useCallback(() => {
    return selectedShape !== null;
  }, [selectedShape]);

  const createRectangle = useCallback(
    (rectangle: Rectangle) => {
      executeAction(
        new CreateDrawingAction([
          {
            id: uuid.v4(),
            layerId: getSelectedLayerId() ?? -1,
            shapeType: DrawingShapeType.Rectangle,
            rotation: 0,
            addDate: timelineDate,
            x: Math.round(rectangle.x1),
            y: Math.round(rectangle.y1),
            scaleX: 1,
            scaleY: 1,
            color: rectangle.color,
            fillEnabled: rectangle.fillEnabled,
            strokeWidth: rectangle.strokeWidth,
            properties: {
              width: rectangle.x2 - rectangle.x1,
              height: rectangle.y2 - rectangle.y1,
            },
          },
        ]),
      );
    },
    [executeAction, getSelectedLayerId, timelineDate],
  );

  const createEllipse = useCallback(
    (ellipse: Ellipse) => {
      executeAction(
        new CreateDrawingAction([
          {
            id: uuid.v4(),
            layerId: getSelectedLayerId() ?? -1,
            rotation: 0,
            addDate: timelineDate,
            shapeType: DrawingShapeType.Ellipse,
            scaleX: 1,
            scaleY: 1,
            x: Math.round(ellipse.x),
            y: Math.round(ellipse.y),
            color: ellipse.color,
            fillEnabled: ellipse.fillEnabled,
            strokeWidth: ellipse.strokeWidth,
            properties: {
              radiusX: ellipse.radiusX,
              radiusY: ellipse.radiusY,
            },
          },
        ]),
      );
    },
    [executeAction, getSelectedLayerId, timelineDate],
  );

  const createFreeLine = useCallback(
    (line: Line) => {
      executeAction(
        new CreateDrawingAction([
          {
            id: uuid.v4(),
            layerId: getSelectedLayerId() ?? -1,
            rotation: 0,
            addDate: timelineDate,
            shapeType: DrawingShapeType.FreeLine,
            scaleX: 1,
            scaleY: 1,
            x: Math.round(line.x),
            y: Math.round(line.y),
            fillEnabled: line.fillEnabled,
            color: line.color,
            strokeWidth: line.strokeWidth,
            properties: {
              points: line.points,
            },
          },
        ]),
      );
    },
    [executeAction, getSelectedLayerId, timelineDate],
  );

  const createBezierLine = useCallback(
    (line: Line) => {
      executeAction(
        new CreateDrawingAction([
          {
            id: uuid.v4(),
            layerId: getSelectedLayerId() ?? -1,
            rotation: 0,
            addDate: timelineDate,
            shapeType: DrawingShapeType.BezierPolygon,
            scaleX: 1,
            scaleY: 1,
            x: 0,
            y: 0,
            fillEnabled: line.fillEnabled,
            color: line.color,
            strokeWidth: line.strokeWidth,
            properties: {
              points: line.points,
            },
          },
        ]),
      );
    },
    [executeAction, getSelectedLayerId, timelineDate],
  );

  const removeDrawingFromSelection = (e: KonvaEventObject<MouseEvent>) => {
    const selectedDrawings = (foundDrawings: DrawingDto[], konvaNode: Konva.Node) => {
      const drawingNode = konvaNode.getAttr('object');
      return drawingNode ? [...foundDrawings, drawingNode] : [foundDrawings];
    };

    const getUpdatedDrawingSelection = () => {
      return transformerActions.getSelection().reduce(selectedDrawings, []) ?? [];
    };

    transformerActions.removeNodeFromSelection(e.currentTarget);
    selectDrawings(getUpdatedDrawingSelection());
  };

  const addDrawingToSelection = (e: KonvaEventObject<MouseEvent>) => {
    transformerActions.addNodeToSelection(e.currentTarget);

    const currentDrawingSelected =
      useMapStore.getState().untrackedState.layers.drawing.selectedDrawings ?? [];
    selectDrawings([...currentDrawingSelected, e.currentTarget.getAttr('object')]);
  };

  const handleMultiSelect = (e: KonvaEventObject<MouseEvent>, drawing: DrawingDto) => {
    isDrawingSelected(drawing) ? removeDrawingFromSelection(e) : addDrawingToSelection(e);
  };

  const handleSingleSelect = (e: KonvaEventObject<MouseEvent>, drawing: DrawingDto) => {
    transformerActions.select(e.currentTarget);
    selectDrawings([drawing], useTransformerStore.getState());
  };

  const handleShapeClicked = (e: KonvaEventObject<MouseEvent>) => {
    moveToTop(e);

    if (isShapeSelected()) return;

    isUsingModifierKey(e)
      ? handleMultiSelect(e, e.currentTarget.getAttr('object'))
      : handleSingleSelect(e, e.currentTarget.getAttr('object'));
  };

  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!isShapeSelected || !isDrawingLayerActive) return;

      if (e.target.getStage() == null) return;

      const stage = e.target.getStage();
      if (stage == null) return;

      const pos = stage.getRelativePointerPosition();
      if (pos == null) return;

      if (selectedShape == DrawingShapeType.FreeLine) {
        isDrawing.current = true;
        setNewLine({
          strokeWidth: selectedStrokeWidth,
          fillEnabled: fillEnabled,
          color: selectedColor,
          x: pos.x,
          y: pos.y,
          points: [[0, 0]],
        });
      } else if (selectedShape == DrawingShapeType.Rectangle) {
        isDrawing.current = true;
        setPreviewRectangle({
          color: selectedColor,
          fillEnabled: fillEnabled,
          strokeWidth: selectedStrokeWidth,
          x1: pos.x,
          y1: pos.y,
          x2: pos.x,
          y2: pos.y,
        });
      } else if (selectedShape == DrawingShapeType.Ellipse) {
        isDrawing.current = true;
        setPreviewEllipse({
          color: selectedColor,
          fillEnabled: fillEnabled,
          strokeWidth: selectedStrokeWidth,
          x: pos.x,
          y: pos.y,
          radiusX: 0,
          radiusY: 0,
        });
      } else if (selectedShape == DrawingShapeType.BezierPolygon) {
        if (!newBezierLine) {
          setNewBezierLine({
            color: selectedColor,
            fillEnabled: fillEnabled,
            strokeWidth: selectedStrokeWidth,
            x: pos.x,
            y: pos.y,
            points: [],
          });
        }
      }
    },
    [
      isShapeSelected,
      isDrawingLayerActive,
      selectedShape,
      selectedStrokeWidth,
      selectedColor,
      fillEnabled,
      newBezierLine,
    ],
  );

  const handleFinishBezierLine = () => {
    if (selectedShape == DrawingShapeType.BezierPolygon) {
      if (newBezierLine) {
        createBezierLine(newBezierLine);
        setNewBezierLine(undefined);
      }
    }
  };

  const handleDrawLine = useCallback(
    (point: Vector2d) => {
      if (!newLine) return;

      const flatPoints = newLine.points.flat();

      const distance = Math.sqrt(
        Math.pow(point.x - flatPoints[flatPoints.length - 2], 2) +
          Math.pow(point.y - flatPoints[flatPoints.length - 1], 2),
      );

      if (distance > 10) {
        setNewLine({
          ...newLine,
          points: [...newLine.points, [point.x - newLine.x, point.y - newLine.y]],
        });
      }
    },
    [newLine],
  );

  const handleDrawRectangle = useCallback(
    (point: Vector2d) => {
      if (!previewRectangle) return;
      setPreviewRectangle({
        fillEnabled: fillEnabled,
        strokeWidth: selectedStrokeWidth,
        color: selectedColor,
        x1: previewRectangle?.x1,
        y1: previewRectangle?.y1,
        x2: point.x,
        y2: point.y,
      });
    },
    [fillEnabled, previewRectangle, selectedColor, selectedStrokeWidth],
  );

  const handleDrawSquare = useCallback(
    (point: Vector2d) => {
      if (!previewRectangle) return;

      setPreviewRectangle({
        fillEnabled: fillEnabled,
        strokeWidth: selectedStrokeWidth,
        color: selectedColor,
        x1: previewRectangle?.x1,
        y1: previewRectangle?.y1,
        x2: point.x,
        y2: previewRectangle?.y1 + (point.x - previewRectangle?.x1),
      });
    },
    [fillEnabled, previewRectangle, selectedColor, selectedStrokeWidth],
  );

  const handleDrawEllipse = useCallback(
    (point: Vector2d) => {
      if (!previewEllipse) return;
      setPreviewEllipse({
        fillEnabled: fillEnabled,
        strokeWidth: selectedStrokeWidth,
        color: selectedColor,
        x: previewEllipse.x,
        y: previewEllipse.y,
        radiusX: Math.abs(point.x - previewEllipse.x),
        radiusY: Math.abs(point.y - previewEllipse.y),
      });
    },
    [fillEnabled, previewEllipse, selectedColor, selectedStrokeWidth],
  );

  const handleDrawCircle = useCallback(
    (point: Vector2d) => {
      if (!previewEllipse) return;

      const radius = Math.abs(point.x - previewEllipse.x);
      setPreviewEllipse({
        fillEnabled: fillEnabled,
        strokeWidth: selectedStrokeWidth,
        color: selectedColor,
        x: previewEllipse.x,
        y: previewEllipse.y,
        radiusX: radius,
        radiusY: radius,
      });
    },
    [fillEnabled, previewEllipse, selectedColor, selectedStrokeWidth],
  );

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!isDrawingLayerActive || !isDrawing.current) {
        return;
      }

      const stage = e.target.getStage();
      if (stage == null) return;

      const point = stage.getRelativePointerPosition();
      if (point == null) return;

      switch (selectedShape) {
        case DrawingShapeType.FreeLine:
          handleDrawLine(point);
          break;
        case DrawingShapeType.Rectangle:
          if (e.evt.shiftKey) {
            handleDrawSquare(point);
          } else {
            handleDrawRectangle(point);
          }
          break;
        case DrawingShapeType.Ellipse:
          if (e.evt.shiftKey) {
            handleDrawCircle(point);
          } else {
            handleDrawEllipse(point);
          }
          break;
      }
    },
    [
      handleDrawCircle,
      handleDrawEllipse,
      handleDrawLine,
      handleDrawRectangle,
      handleDrawSquare,
      isDrawingLayerActive,
      selectedShape,
    ],
  );

  const handleFreeLineMouseUp = useCallback(() => {
    if (!newLine) return;
    createFreeLine(newLine);
    setNewLine(undefined);
  }, [createFreeLine, newLine]);

  const handleRectangleMouseUp = useCallback(() => {
    if (!previewRectangle) return;

    const newRect: Rectangle = {
      color: selectedColor,
      fillEnabled: fillEnabled,
      strokeWidth: selectedStrokeWidth,
      x1: Math.min(previewRectangle.x1, previewRectangle.x2),
      x2: Math.max(previewRectangle.x1, previewRectangle.x2),
      y1: Math.min(previewRectangle.y1, previewRectangle.y2),
      y2: Math.max(previewRectangle.y1, previewRectangle.y2),
    };

    setPreviewRectangle(undefined);
    createRectangle(newRect);
  }, [createRectangle, fillEnabled, previewRectangle, selectedColor, selectedStrokeWidth]);

  const handleEllipseMouseUp = useCallback(() => {
    if (!previewEllipse) return;

    const newEllipse: Ellipse = {
      fillEnabled: fillEnabled,
      strokeWidth: selectedStrokeWidth,
      color: selectedColor,
      x: previewEllipse.x,
      y: previewEllipse.y,
      radiusX: previewEllipse.radiusX,
      radiusY: previewEllipse.radiusY,
    };

    setPreviewEllipse(undefined);
    createEllipse(newEllipse);
  }, [createEllipse, fillEnabled, previewEllipse, selectedColor, selectedStrokeWidth]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawingLayerActive) return;
    isDrawing.current = false;

    switch (selectedShape) {
      case DrawingShapeType.FreeLine:
        handleFreeLineMouseUp();
        break;
      case DrawingShapeType.Rectangle:
        handleRectangleMouseUp();
        break;
      case DrawingShapeType.Ellipse:
        handleEllipseMouseUp();
        break;
    }
  }, [
    handleEllipseMouseUp,
    handleFreeLineMouseUp,
    handleRectangleMouseUp,
    isDrawingLayerActive,
    selectedShape,
  ]);

  const moveToTop = (e: KonvaEventObject<MouseEvent>) => {
    e.target.moveToTop();
  };

  const handleSelectDrawing: KonvaEventListener<Konva.Stage, MouseEvent> = useCallback(() => {
    const selectedDrawings = (foundDrawings: DrawingDto[], konvaNode: Konva.Node) => {
      const drawingNode = konvaNode.getAttr('object');
      return drawingNode ? [...foundDrawings, drawingNode] : [foundDrawings];
    };

    const transformerActions = useTransformerStore.getState().actions;
    const drawings = transformerActions.getSelection().reduce(selectedDrawings, []);

    if (drawings?.length) {
      useMapStore.getState().selectDrawings(drawings);
    }
  }, []);

  const handleTransformDrawing: KonvaEventListener<Konva.Transformer, unknown> = useCallback(() => {
    const transformerActions = useTransformerStore.getState().actions;
    const nodes = transformerActions.getSelection();
    if (!nodes.length) {
      return;
    }

    const updates = nodes.map((node) => {
      const drawing = node.getAttr('object');

      return {
        ...drawing,
        id: node.id(),
        x: Math.round(node.x()),
        y: Math.round(node.y()),
        rotation: node.rotation(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
      };
    });

    executeAction(new UpdateDrawingAction(updates));
  }, [executeAction]);

  const handleMoveDrawing: KonvaEventListener<Konva.Transformer, unknown> = useCallback(() => {
    const transformerActions = useTransformerStore.getState().actions;
    const nodes = transformerActions.getSelection().filter((node) => !node.attrs.isControlElement);
    if (!nodes.length) {
      return;
    }

    const updates = nodes.map((node) => {
      const drawing = node.getAttr('object');

      return {
        ...drawing,
        x: Math.round(node.x()),
        y: Math.round(node.y()),
      };
    });

    executeAction(new UpdateDrawingAction(updates));
  }, [executeAction]);

  const handleBezierPointsChanged = useCallback(
    (id: string, points: number[][]) => {
      const bezierLine = bezierLines.find((line) => line.id === id);

      if (!bezierLine) return;

      const updates = [
        {
          ...bezierLine,
          properties: {
            points: points,
          },
        },
      ];

      executeAction(new UpdateDrawingAction(updates));
    },
    [bezierLines, executeAction],
  );

  useEffect(() => {
    if (selectedShape != DrawingShapeType.BezierPolygon && newBezierLine) {
      createBezierLine(newBezierLine);
      setNewBezierLine(undefined);
    }
  }, [selectedShape]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!props.listening) {
      return;
    }

    const transformerActions = useTransformerStore.getState().actions;
    useMapStore.getState().stageRef.current?.on('mousedown.startDrawing', handleMouseDown);
    useMapStore.getState().stageRef.current?.on('mousemove.draw', handleMouseMove);
    useMapStore.getState().stageRef.current?.on('mouseup.endDrawing', handleMouseUp);
    useMapStore.getState().stageRef.current?.on('mouseup.selectDrawing', handleSelectDrawing);
    transformerActions.addEventListener('dragend.drawings', handleMoveDrawing);
    transformerActions.addEventListener('transformend.drawings', handleTransformDrawing);

    return () => {
      useMapStore.getState().stageRef.current?.off('mousedown.startDrawing');
      useMapStore.getState().stageRef.current?.off('mousemove.draw');
      useMapStore.getState().stageRef.current?.off('mouseup.endDrawing');
      useMapStore.getState().stageRef.current?.off('mouseup.selectDrawing');
      transformerActions.removeEventListener('dragend.drawings');
      transformerActions.removeEventListener('transformend.drawings');
    };
  }, [
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMoveDrawing,
    handleSelectDrawing,
    handleTransformDrawing,
    props.listening,
  ]);

  const updateNewBezierLinePoints = (points: number[][]) => {
    if (!newBezierLine) return;

    setNewBezierLine({
      ...newBezierLine,
      points: points,
    });
  };

  const transformerRef = useRef<Konva.Transformer>(null);

  return (
    <>
      <Layer {...layerProps} name={`${LayerType.Drawing}`}>
        {bezierLines.map((bezierLine, i) => (
          <BezierPolygon
            key={`bezier-line-${i}`}
            transformerRef={transformerRef}
            id={bezierLine.id}
            object={bezierLine}
            editMode={editDrawingId === bezierLine.id ? editMode : undefined}
            onPointsChanged={(p) => handleBezierPointsChanged(bezierLine.id, p)}
            initialPoints={bezierLine.properties.points}
            strokeWidth={bezierLine.strokeWidth}
            onLineClick={handleShapeClicked}
            color={bezierLine.color}
            fillEnabled={bezierLine.fillEnabled}
            x={bezierLine.x}
            y={bezierLine.y}
            scaleX={bezierLine.scaleX}
            scaleY={bezierLine.scaleY}
            onDragStart={moveToTop}
          ></BezierPolygon>
        ))}

        {newBezierLine && (
          <BezierPolygon
            id="new-bezier-line"
            key={`new-bezier-line`}
            onFinishLine={handleFinishBezierLine}
            onPointsChanged={updateNewBezierLinePoints}
            initialPoints={newBezierLine.points}
            editMode={selectedShape == DrawingShapeType.BezierPolygon ? 'draw' : undefined}
            strokeWidth={selectedStrokeWidth}
            color={selectedColor}
            scaleX={1}
            scaleY={1}
            x={0}
            y={0}
          ></BezierPolygon>
        )}

        {lines.map((line, i) => (
          <Line
            id={line.id}
            listening={true}
            object={line}
            hitStrokeWidth={(line.strokeWidth ? 1 : 0) + 100}
            key={i}
            x={line.x}
            y={line.y}
            scaleX={line.scaleX}
            scaleY={line.scaleY}
            points={line.properties.points.flat()}
            stroke={line.color}
            fill={line.color}
            fillEnabled={line.fillEnabled}
            closed={line.fillEnabled}
            strokeWidth={line.strokeWidth}
            tension={0.1}
            lineCap="round"
            lineJoin="round"
            onClick={handleShapeClicked}
            draggable
            onDragStart={moveToTop}
            bezier
            rotation={line.rotation}
            globalCompositeOperation="source-over"
          />
        ))}

        {newLine && (
          <Line
            listening={true}
            canBeDistorted={false}
            key={'new-line'}
            x={newLine.x}
            y={newLine.y}
            points={newLine.points.flat()}
            stroke={newLine.color}
            strokeWidth={newLine.strokeWidth}
            tension={0.2}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation="source-over"
            onClick={handleShapeClicked}
            draggable
            onDragStart={moveToTop}
          />
        )}

        {rectangles.map((rectangle, i) => (
          <Rect
            id={rectangle.id}
            canBeDistorted={true}
            listening={true}
            object={rectangle}
            hitStrokeWidth={rectangle.strokeWidth + 40}
            cornerRadius={5}
            key={`rect-${i}`}
            x={rectangle.x}
            y={rectangle.y}
            rotation={rectangle.rotation}
            width={rectangle.properties.width}
            height={rectangle.properties.height}
            stroke={rectangle.color}
            fill={rectangle.color}
            fillEnabled={rectangle.fillEnabled}
            strokeWidth={rectangle.strokeWidth}
            scaleX={rectangle.scaleX}
            scaleY={rectangle.scaleY}
            onClick={handleShapeClicked}
            draggable
            onDragStart={moveToTop}
          ></Rect>
        ))}

        {previewRectangle && (
          <Rect
            cornerRadius={5}
            key={'preview-rect'}
            x={Math.min(previewRectangle.x1, previewRectangle.x2)}
            y={Math.min(previewRectangle.y1, previewRectangle.y2)}
            width={Math.abs(previewRectangle.x1 - previewRectangle.x2)}
            height={Math.abs(previewRectangle.y1 - previewRectangle.y2)}
            stroke={previewRectangle.color}
            strokeWidth={previewRectangle.strokeWidth}
            fill={previewRectangle.color}
            fillEnabled={previewRectangle.fillEnabled}
          ></Rect>
        )}

        {ellipses.map((ellipse, i) => (
          <Ellipse
            id={ellipse.id}
            listening={true}
            object={ellipse}
            canBeDistorted={true}
            key={`ellipse-${i}`}
            x={ellipse.x}
            hitStrokeWidth={ellipse.strokeWidth + 40}
            y={ellipse.y}
            rotation={ellipse.rotation}
            scaleX={ellipse.scaleX}
            scaleY={ellipse.scaleY}
            radiusX={ellipse.properties.radiusX}
            radiusY={ellipse.properties.radiusY}
            stroke={ellipse.color}
            fill={ellipse.color}
            fillEnabled={ellipse.fillEnabled}
            strokeWidth={ellipse.strokeWidth}
            onClick={handleShapeClicked}
            draggable
            onDragStart={moveToTop}
          />
        ))}

        {previewEllipse && (
          <Ellipse
            key="preview-ellipse"
            x={previewEllipse.x}
            y={previewEllipse.y}
            radiusX={previewEllipse.radiusX}
            radiusY={previewEllipse.radiusY}
            stroke={previewEllipse.color}
            strokeWidth={previewEllipse.strokeWidth}
            fill={previewEllipse.color}
            fillEnabled={previewEllipse.fillEnabled}
          />
        )}
      </Layer>
    </>
  );
}

function isDrawingSelected(drawing: DrawingDto): boolean {
  const allSelectedDrawings = useMapStore.getState().untrackedState.layers.drawing.selectedDrawings;

  return Boolean(allSelectedDrawings?.find((selectedDrawing) => selectedDrawing.id === drawing.id));
}

function isUsingModifierKey(e: KonvaEventObject<MouseEvent>): boolean {
  return e.evt.ctrlKey || e.evt.shiftKey || e.evt.metaKey;
}

export default DrawingLayer;
