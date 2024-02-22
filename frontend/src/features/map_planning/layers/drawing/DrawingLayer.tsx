import Konva from 'konva';
import { KonvaEventListener, KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Ellipse, Layer, Line, Rect } from 'react-konva';
import * as uuid from 'uuid';
import { LayerType } from '@/api_types/definitions';
import useMapStore from '../../store/MapStore';
import { useTransformerStore } from '../../store/transformer/TransformerStore';
import { LayerConfigWithListenerRegister } from '../../types/layer-config';
import { isDrawingLayerActive } from '../../utils/layer-utils';
import { CreateDrawingAction, MoveDrawingAction, TransformDrawingAction } from './actions';
import BezierPolygon from './shapes/BezierPolygon';
import { DrawingDto, EllipseProperties, FreeLineProperties, RectangleProperties } from './types';

type DrawingLayerProps = LayerConfigWithListenerRegister;

type Rectangle = {
  color: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type Ellipse = {
  color: string;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
};

type Line = {
  color: string;
  strokeWidth: number;
  x: number;
  y: number;
  points: number[][];
};

function DrawingLayer(props: DrawingLayerProps) {
  const drawingObjects = useMapStore((state) => state.trackedState.layers.drawing.objects);
  const transformerActions = useTransformerStore((state) => state.actions);

  const selectedShape = useMapStore((state) => state.untrackedState.layers.drawing.shape);
  const selectedColor = useMapStore((state) => state.untrackedState.layers.drawing.selectedColor);
  const selectedStrokeWidth = useMapStore(
    (state) => state.untrackedState.layers.drawing.selectedStrokeWidth,
  );

  const selectDrawings = useMapStore((state) => state.selectDrawings);

  const { ...layerProps } = props;

  const rectangles = drawingObjects
    .filter((object) => object.type === 'rectangle')
    .map((object) => {
      return {
        ...object,
        properties: object.properties as RectangleProperties,
      };
    });

  const ellipses = drawingObjects
    .filter((object) => object.type === 'ellipse')
    .map((object) => {
      return {
        ...object,
        properties: object.properties as EllipseProperties,
      };
    });

  const lines = drawingObjects
    .filter((object) => object.type === 'freeLine')
    .map((object) => {
      return {
        ...object,
        properties: object.properties as FreeLineProperties,
      };
    });

  const bezierLines = drawingObjects
    .filter((object) => object.type === 'bezierPolygon')
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

  const activeShape = useMapStore((state) => state.untrackedState.layers.drawing.activeShape);

  const isDrawing = useRef(false);

  const getSelectedLayerId = useMapStore((state) => state.getSelectedLayerId);
  const timelineDate = useMapStore((state) => state.untrackedState.timelineDate);
  const executeAction = useMapStore((state) => state.executeAction);

  const isShapeSelected = useCallback(() => {
    return selectedShape !== null;
  }, [selectedShape]);

  const createRectangle = useCallback(
    (rectangle: Rectangle) => {
      executeAction(
        new CreateDrawingAction({
          id: uuid.v4(),
          layerId: getSelectedLayerId() ?? -1,
          type: 'rectangle',
          rotation: 0,
          addDate: timelineDate,
          x: rectangle.x1,
          y: rectangle.y1,
          scaleX: 1,
          scaleY: 1,
          color: rectangle.color,
          properties: {
            width: rectangle.x2 - rectangle.x1,
            height: rectangle.y2 - rectangle.y1,
          },
        }),
      );
    },
    [executeAction, getSelectedLayerId, timelineDate],
  );

  const createEllipse = useCallback(
    (ellipse: Ellipse) => {
      executeAction(
        new CreateDrawingAction({
          id: uuid.v4(),
          layerId: getSelectedLayerId() ?? -1,
          rotation: 0,
          addDate: timelineDate,
          type: 'ellipse',
          scaleX: 1,
          scaleY: 1,
          x: ellipse.x,
          y: ellipse.y,
          color: ellipse.color,
          properties: {
            radiusX: ellipse.radiusX,
            radiusY: ellipse.radiusY,
          },
        }),
      );
    },
    [executeAction, getSelectedLayerId, timelineDate],
  );

  const createFreeLine = useCallback(
    (line: Line) => {
      executeAction(
        new CreateDrawingAction({
          id: uuid.v4(),
          layerId: getSelectedLayerId() ?? -1,
          rotation: 0,
          addDate: timelineDate,
          type: 'freeLine',
          scaleX: 1,
          scaleY: 1,
          x: line.x,
          y: line.y,
          color: line.color,
          strokeWidth: line.strokeWidth,
          properties: {
            points: line.points,
          },
        }),
      );
    },
    [executeAction, getSelectedLayerId, timelineDate],
  );

  const createBezierLine = useCallback(
    (line: Line) => {
      executeAction(
        new CreateDrawingAction({
          id: uuid.v4(),
          layerId: getSelectedLayerId() ?? -1,
          rotation: 0,
          addDate: timelineDate,
          type: 'bezierPolygon',
          scaleX: 1,
          scaleY: 1,
          x: 0,
          y: 0,
          color: line.color,
          strokeWidth: line.strokeWidth,
          properties: {
            points: line.points,
          },
        }),
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

  const addPlantingToSelection = (e: KonvaEventObject<MouseEvent>) => {
    transformerActions.addNodeToSelection(e.currentTarget);

    const currentDrawingSelected =
      useMapStore.getState().untrackedState.layers.drawing.selectedDrawings ?? [];
    selectDrawings([...currentDrawingSelected, e.currentTarget.getAttr('object')]);
  };

  const handleMultiSelect = (e: KonvaEventObject<MouseEvent>, drawing: DrawingDto) => {
    isDrawingSelected(drawing) ? removeDrawingFromSelection(e) : addPlantingToSelection(e);
  };

  const handleSingleSelect = (e: KonvaEventObject<MouseEvent>, drawing: DrawingDto) => {
    transformerActions.select(e.currentTarget);
    selectDrawings([drawing], useTransformerStore.getState());
  };

  const handleShapeClicked = (e: KonvaEventObject<MouseEvent>) => {
    if (isShapeSelected()) return;

    isUsingModifierKey(e)
      ? handleMultiSelect(e, e.currentTarget.getAttr('object'))
      : handleSingleSelect(e, e.currentTarget.getAttr('object'));
  };

  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!isShapeSelected || !isDrawingLayerActive()) return;

      if (e.target.getStage() == null) return;

      const stage = e.target.getStage();
      if (stage == null) return;

      const pos = stage.getRelativePointerPosition();
      if (pos == null) return;

      if (selectedShape == 'freeLine') {
        isDrawing.current = true;
        setNewLine({
          strokeWidth: selectedStrokeWidth,
          color: selectedColor,
          x: pos.x,
          y: pos.y,
          points: [[0, 0]],
        });
      } else if (selectedShape == 'rectangle') {
        isDrawing.current = true;
        setPreviewRectangle({ color: selectedColor, x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
      } else if (selectedShape == 'ellipse') {
        isDrawing.current = true;
        setPreviewEllipse({ color: selectedColor, x: pos.x, y: pos.y, radiusX: 0, radiusY: 0 });
      } else if (selectedShape == 'bezierPolygon') {
        if (!newBezierLine) {
          setNewBezierLine({
            color: selectedColor,
            strokeWidth: selectedStrokeWidth,
            x: pos.x,
            y: pos.y,
            points: [],
          });
        }
      }
    },
    [isShapeSelected, newBezierLine, selectedColor, selectedShape, selectedStrokeWidth],
  );

  const handleFinishBezierLine = () => {
    if (selectedShape == 'bezierPolygon') {
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
        color: selectedColor,
        x1: previewRectangle?.x1,
        y1: previewRectangle?.y1,
        x2: point.x,
        y2: point.y,
      });
    },
    [previewRectangle, selectedColor],
  );

  const handleDrawSquare = useCallback(
    (point: Vector2d) => {
      if (!previewRectangle) return;

      setPreviewRectangle({
        color: selectedColor,
        x1: previewRectangle?.x1,
        y1: previewRectangle?.y1,
        x2: point.x,
        y2: previewRectangle?.y1 + (point.x - previewRectangle?.x1),
      });
    },
    [previewRectangle, selectedColor],
  );

  const handleDrawEllipse = useCallback(
    (point: Vector2d) => {
      if (!previewEllipse) return;
      setPreviewEllipse({
        color: selectedColor,
        x: previewEllipse.x,
        y: previewEllipse.y,
        radiusX: Math.abs(point.x - previewEllipse.x),
        radiusY: Math.abs(point.y - previewEllipse.y),
      });
    },
    [previewEllipse, selectedColor],
  );

  const handleDrawCircle = useCallback(
    (point: Vector2d) => {
      if (!previewEllipse) return;

      const radius = Math.abs(point.x - previewEllipse.x);
      setPreviewEllipse({
        color: selectedColor,
        x: previewEllipse.x,
        y: previewEllipse.y,
        radiusX: radius,
        radiusY: radius,
      });
    },
    [previewEllipse, selectedColor],
  );

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!isDrawingLayerActive() || !isDrawing.current) {
        return;
      }

      const stage = e.target.getStage();
      if (stage == null) return;

      const point = stage.getRelativePointerPosition();
      if (point == null) return;

      switch (selectedShape) {
        case 'freeLine':
          handleDrawLine(point);
          break;
        case 'rectangle':
          if (e.evt.shiftKey) {
            handleDrawSquare(point);
          } else {
            handleDrawRectangle(point);
          }
          break;
        case 'ellipse':
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
      x1: Math.min(previewRectangle.x1, previewRectangle.x2),
      x2: Math.max(previewRectangle.x1, previewRectangle.x2),
      y1: Math.min(previewRectangle.y1, previewRectangle.y2),
      y2: Math.max(previewRectangle.y1, previewRectangle.y2),
    };

    setPreviewRectangle(undefined);
    createRectangle(newRect);
  }, [createRectangle, previewRectangle, selectedColor]);

  const handleEllipseMouseUp = useCallback(() => {
    if (!previewEllipse) return;

    const newEllipse: Ellipse = {
      color: selectedColor,
      x: previewEllipse.x,
      y: previewEllipse.y,
      radiusX: previewEllipse.radiusX,
      radiusY: previewEllipse.radiusY,
    };

    setPreviewEllipse(undefined);
    createEllipse(newEllipse);
  }, [createEllipse, previewEllipse, selectedColor]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawingLayerActive()) return;
    isDrawing.current = false;

    switch (selectedShape) {
      case 'freeLine':
        handleFreeLineMouseUp();
        break;
      case 'rectangle':
        handleRectangleMouseUp();
        break;
      case 'ellipse':
        handleEllipseMouseUp();
        break;
    }
  }, [handleEllipseMouseUp, handleFreeLineMouseUp, handleRectangleMouseUp, selectedShape]);

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

    console.log(drawings);
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
      return {
        id: node.id(),
        x: Math.round(node.x()),
        y: Math.round(node.y()),
        rotation: node.rotation(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
      };
    });

    executeAction(new TransformDrawingAction(updates));
  }, [executeAction]);

  const handleMoveDrawing: KonvaEventListener<Konva.Transformer, unknown> = useCallback(() => {
    const transformerActions = useTransformerStore.getState().actions;
    const nodes = transformerActions.getSelection().filter((node) => !node.attrs.isControlElement);
    if (!nodes.length) {
      return;
    }

    const updates = nodes.map((node) => {
      return {
        id: node.id(),
        x: Math.round(node.x()),
        y: Math.round(node.y()),
      };
    });

    // Remove null values
    const filteredUpdates = updates.filter((update) => update !== null) as {
      id: string;
      x: number;
      y: number;
    }[];

    console.log('filteredUpdates', filteredUpdates);
    if (!filteredUpdates.length) return;
    executeAction(new MoveDrawingAction(filteredUpdates));
  }, [executeAction]);

  useEffect(() => {
    if (selectedShape != 'bezierPolygon' && newBezierLine) {
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

  return (
    <>
      <Layer {...layerProps} name={`${LayerType.Drawing}`}>
        {bezierLines.map((bezierLine, i) => (
          <BezierPolygon
            key={`bezier-line-${i}`}
            object={bezierLine}
            editModeActive={activeShape === bezierLine.id}
            drawingModeActive={activeShape === bezierLine.id}
            onPointsChanged={console.log}
            initialPoints={bezierLine.properties.points}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            strokeWidth={bezierLine.strokeWidth!}
            onLineClick={handleShapeClicked}
            color={bezierLine.color}
            x={bezierLine.x}
            y={bezierLine.y}
            scaleX={bezierLine.scaleX}
            scaleY={bezierLine.scaleY}
          ></BezierPolygon>
        ))}

        {newBezierLine && (
          <BezierPolygon
            key={`new-bezier-line`}
            onFinishLine={handleFinishBezierLine}
            onPointsChanged={updateNewBezierLinePoints}
            initialPoints={newBezierLine.points}
            drawingModeActive={selectedShape == 'bezierPolygon'}
            editModeActive={selectedShape == 'bezierPolygon'}
            strokeWidth={selectedStrokeWidth}
            color={selectedColor}
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
            strokeWidth={line.strokeWidth}
            tension={0.1}
            lineCap="round"
            lineJoin="round"
            onClick={handleShapeClicked}
            draggable
            onDragStart={moveToTop}
            bezier
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
            cornerRadius={5}
            key={`rect-${i}`}
            x={rectangle.x}
            y={rectangle.y}
            width={rectangle.properties.width}
            height={rectangle.properties.height}
            stroke={rectangle.color}
            fill={rectangle.color}
            strokeWidth={5}
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
            strokeWidth={5}
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
            y={ellipse.y}
            scaleX={ellipse.scaleX}
            scaleY={ellipse.scaleY}
            radiusX={ellipse.properties.radiusX}
            radiusY={ellipse.properties.radiusY}
            stroke={ellipse.color}
            fill={ellipse.color}
            strokeWidth={5}
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
            strokeWidth={5}
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
