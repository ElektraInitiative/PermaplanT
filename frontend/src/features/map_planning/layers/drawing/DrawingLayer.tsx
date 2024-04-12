import Konva from 'konva';
import { LayerConfig } from 'konva/lib/Layer';
import { KonvaEventListener, KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Ellipse, Layer, Line, Rect, Text } from 'react-konva';
import * as uuid from 'uuid';
import {
  DrawingDto,
  DrawingShapeType,
  LayerType,
  FillPatternType,
  RectangleProperties,
  EllipseProperties,
  FreeLineProperties,
  LabelTextProperties,
  ImageProperties,
  PolygonProperties,
} from '@/api_types/definitions';
import {
  KEYBINDINGS_SCOPE_DRAWING_LAYER,
  createKeyBindingsAccordingToConfig,
} from '@/config/keybindings';
import { useKeyHandlers } from '@/hooks/useKeyHandlers';
import { getFillPattern } from '@/utils/fillPatterns';
import { NextcloudKonvaImage } from '../../components/image/NextcloudKonvaImage';
import useMapStore from '../../store/MapStore';
import { useTransformerStore } from '../../store/transformer/TransformerStore';
import { useIsDrawingLayerActive } from '../../utils/layer-utils';
import { CreateDrawingAction, UpdateDrawingAction } from './actions';
import { useDeleteSelectedDrawings } from './hooks/useDeleteSelectedDrawings';
import { EditableText } from './labels/EditableText';
import BezierPolygon from './shapes/BezierPolygon';

type DrawingLayerProps = LayerConfig;

type Rectangle = {
  color: string;
  fillPattern: FillPatternType;
  strokeWidth: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type Ellipse = {
  fillPattern: FillPatternType;
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
  fillPattern: FillPatternType;
  x: number;
  y: number;
  points: number[][];
};

type Text = {
  color: string;
  text: string;
  scaleX: number;
  scaleY: number;
  x: number;
  y: number;
};

type Image = {
  path: string;
  scaleX: number;
  scaleY: number;
  x: number;
  y: number;
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
  const drawingObjects = useMapStore((state) => state.trackedState.layers.drawing.objects);
  const transformerActions = useTransformerStore((state) => state.actions);

  const selectedShape = useMapStore((state) => state.untrackedState.layers.drawing.selectedShape);
  const selectedColor = useMapStore((state) => state.untrackedState.layers.drawing.selectedColor);
  const selectedStrokeWidth = useMapStore(
    (state) => state.untrackedState.layers.drawing.selectedStrokeWidth,
  );
  const selectedIcon = useMapStore((state) => state.untrackedState.layers.drawing.selectedIconPath);

  const fillPattern = useMapStore((state) => state.untrackedState.layers.drawing.fillPattern);
  const isDrawingLayerActive = useIsDrawingLayerActive();

  const mapScale = useMapStore.getState().stageRef.current?.scale();
  const mapScaleX = mapScale?.x || 1;
  const mapScaleY = mapScale?.y || 1;

  const selectDrawings = useMapStore((state) => state.selectDrawings);

  useDrawingLayerKeyListeners();

  const { ...layerProps } = props;

  const rectangles = drawingObjects.filter(
    (object) => object.variant.type === DrawingShapeType.Rectangle,
  );

  const ellipses = drawingObjects.filter(
    (object) => object.variant.type === DrawingShapeType.Ellipse,
  );

  const lines = drawingObjects.filter(
    (object) => object.variant.type === DrawingShapeType.FreeLine,
  );

  const bezierLines = drawingObjects.filter(
    (object) => object.variant.type === DrawingShapeType.BezierPolygon,
  );

  const textLabels = drawingObjects.filter(
    (object) => object.variant.type === DrawingShapeType.LabelText,
  );

  const images = drawingObjects.filter((object) => object.variant.type === DrawingShapeType.Image);

  const [newLine, setNewLine] = useState<Line>();
  const [newBezierLine, setNewBezierLine] = useState<Line>();
  const [newLabelText, setNewLabelText] = useState<Text>();
  const [newImage, setNewImage] = useState<Image>();

  const [previewRectangle, setPreviewRectangle] = useState<Rectangle | undefined>();
  const [previewEllipse, setPreviewEllipse] = useState<Ellipse | undefined>();

  const editMode = useMapStore((state) => state.untrackedState.layers.drawing.editMode);
  const editDrawingId = useMapStore((state) => state.untrackedState.layers.drawing.editDrawingId);

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
        new CreateDrawingAction([
          {
            id: uuid.v4(),
            layerId: getSelectedLayerId() ?? -1,
            variant: {
              type: DrawingShapeType.Rectangle,
              properties: {
                width: rectangle.x2 - rectangle.x1,
                height: rectangle.y2 - rectangle.y1,
                color: rectangle.color,
                fillPattern: rectangle.fillPattern,
                strokeWidth: rectangle.strokeWidth,
              },
            },
            rotation: 0,
            addDate: timelineDate,
            x: Math.round(rectangle.x1),
            y: Math.round(rectangle.y1),
            scaleX: 1,
            scaleY: 1,
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
            variant: {
              type: DrawingShapeType.Ellipse,
              properties: {
                radiusX: ellipse.radiusX,
                radiusY: ellipse.radiusY,
                color: ellipse.color,
                fillPattern: ellipse.fillPattern,
                strokeWidth: ellipse.strokeWidth,
              },
            },
            scaleX: 1,
            scaleY: 1,
            x: Math.round(ellipse.x),
            y: Math.round(ellipse.y),
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
            variant: {
              type: DrawingShapeType.FreeLine,
              properties: {
                points: line.points,
                color: line.color,
                fillPattern: line.fillPattern,
                strokeWidth: line.strokeWidth,
              },
            },
            scaleX: 1,
            scaleY: 1,
            x: Math.round(line.x),
            y: Math.round(line.y),
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
            variant: {
              type: DrawingShapeType.BezierPolygon,
              properties: {
                points: line.points,
                color: line.color,
                fillPattern: line.fillPattern,
                strokeWidth: line.strokeWidth,
              },
            },
            scaleX: 1,
            scaleY: 1,
            x: 0,
            y: 0,
          },
        ]),
      );
    },
    [executeAction, getSelectedLayerId, timelineDate],
  );

  const createTextLabel = useCallback(
    (text: Text) => {
      executeAction(
        new CreateDrawingAction([
          {
            id: uuid.v4(),
            layerId: getSelectedLayerId() ?? -1,
            rotation: 0,
            addDate: timelineDate,
            variant: {
              type: DrawingShapeType.LabelText,
              properties: {
                text: text.text,
                color: text.color,
                width: 100,
                height: 0,
              },
            },
            scaleX: text.scaleX,
            scaleY: text.scaleY,
            x: Math.round(text.x),
            y: Math.round(text.y),
          },
        ]),
      );
    },
    [executeAction, getSelectedLayerId, timelineDate],
  );

  const createImage = useCallback(
    (image: Image) => {
      executeAction(
        new CreateDrawingAction([
          {
            id: uuid.v4(),
            layerId: getSelectedLayerId() ?? -1,
            rotation: 0,
            addDate: timelineDate,
            variant: {
              type: DrawingShapeType.Image,
              properties: {
                path: image.path,
              },
            },
            scaleX: image.scaleX,
            scaleY: image.scaleY,
            x: Math.round(image.x),
            y: Math.round(image.y),
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
          fillPattern: fillPattern,
          color: selectedColor,
          x: pos.x,
          y: pos.y,
          points: [[0, 0]],
        });
      } else if (selectedShape == DrawingShapeType.Rectangle) {
        isDrawing.current = true;
        setPreviewRectangle({
          color: selectedColor,
          fillPattern: fillPattern,
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
          fillPattern: fillPattern,
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
            fillPattern: fillPattern,
            strokeWidth: selectedStrokeWidth,
            x: pos.x,
            y: pos.y,
            points: [],
          });
        }
      } else if (selectedShape == DrawingShapeType.LabelText) {
        if (newLabelText && newLabelText.text.length > 0) {
          createTextLabel(newLabelText);
          setNewLabelText(undefined);
        } else {
          setNewLabelText({
            color: selectedColor,
            x: pos.x,
            y: pos.y,
            scaleX: 1 / (mapScale?.x || 1),
            scaleY: 1 / (mapScale?.y || 1),
            text: '',
          });
        }
      } else if (selectedShape == DrawingShapeType.Image) {
        if (newImage) {
          createImage(newImage);
          setNewImage(undefined);
        }
      }
    },
    [
      isShapeSelected,
      isDrawingLayerActive,
      selectedShape,
      selectedStrokeWidth,
      fillPattern,
      selectedColor,
      newBezierLine,
      newLabelText,
      createTextLabel,
      mapScale?.x,
      mapScale?.y,
      newImage,
      createImage,
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
      if (!newLine || !isDrawing.current) return;

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
      if (!previewRectangle || !isDrawing.current) return;
      setPreviewRectangle({
        fillPattern: fillPattern,
        strokeWidth: selectedStrokeWidth,
        color: selectedColor,
        x1: previewRectangle?.x1,
        y1: previewRectangle?.y1,
        x2: point.x,
        y2: point.y,
      });
    },
    [fillPattern, previewRectangle, selectedColor, selectedStrokeWidth],
  );

  const handleDrawSquare = useCallback(
    (point: Vector2d) => {
      if (!previewRectangle || !isDrawing.current) return;

      setPreviewRectangle({
        fillPattern: fillPattern,
        strokeWidth: selectedStrokeWidth,
        color: selectedColor,
        x1: previewRectangle?.x1,
        y1: previewRectangle?.y1,
        x2: point.x,
        y2: previewRectangle?.y1 + (point.x - previewRectangle?.x1),
      });
    },
    [fillPattern, previewRectangle, selectedColor, selectedStrokeWidth],
  );

  const handleDrawEllipse = useCallback(
    (point: Vector2d) => {
      if (!previewEllipse || !isDrawing.current) return;
      setPreviewEllipse({
        fillPattern: fillPattern,
        strokeWidth: selectedStrokeWidth,
        color: selectedColor,
        x: previewEllipse.x,
        y: previewEllipse.y,
        radiusX: Math.abs(point.x - previewEllipse.x),
        radiusY: Math.abs(point.y - previewEllipse.y),
      });
    },
    [fillPattern, previewEllipse, selectedColor, selectedStrokeWidth],
  );

  const handleDrawCircle = useCallback(
    (point: Vector2d) => {
      if (!previewEllipse || !isDrawing.current) return;

      const radius = Math.abs(point.x - previewEllipse.x);
      setPreviewEllipse({
        fillPattern: fillPattern,
        strokeWidth: selectedStrokeWidth,
        color: selectedColor,
        x: previewEllipse.x,
        y: previewEllipse.y,
        radiusX: radius,
        radiusY: radius,
      });
    },
    [fillPattern, previewEllipse, selectedColor, selectedStrokeWidth],
  );

  const handleDrawImage = useCallback(
    (point: Vector2d) => {
      if (!selectedIcon) return;

      const newImage: Image = {
        path: selectedIcon,
        scaleX: 1,
        scaleY: 1,
        x: point.x,
        y: point.y,
      };

      setNewImage(newImage);
    },
    [selectedIcon],
  );

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!isDrawingLayerActive) {
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
        case DrawingShapeType.Image:
          handleDrawImage(point);
          break;
      }
    },
    [
      handleDrawCircle,
      handleDrawEllipse,
      handleDrawImage,
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
      fillPattern: fillPattern,
      strokeWidth: selectedStrokeWidth,
      x1: Math.min(previewRectangle.x1, previewRectangle.x2),
      x2: Math.max(previewRectangle.x1, previewRectangle.x2),
      y1: Math.min(previewRectangle.y1, previewRectangle.y2),
      y2: Math.max(previewRectangle.y1, previewRectangle.y2),
    };

    setPreviewRectangle(undefined);
    createRectangle(newRect);
  }, [createRectangle, fillPattern, previewRectangle, selectedColor, selectedStrokeWidth]);

  const handleEllipseMouseUp = useCallback(() => {
    if (!previewEllipse) return;

    const newEllipse: Ellipse = {
      fillPattern: fillPattern,
      strokeWidth: selectedStrokeWidth,
      color: selectedColor,
      x: previewEllipse.x,
      y: previewEllipse.y,
      radiusX: previewEllipse.radiusX,
      radiusY: previewEllipse.radiusY,
    };

    setPreviewEllipse(undefined);
    createEllipse(newEllipse);
  }, [createEllipse, fillPattern, previewEllipse, selectedColor, selectedStrokeWidth]);

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

  const handleUnselectDrawing: KonvaEventListener<Konva.Stage, MouseEvent> = useCallback((e) => {
    // only unselect if we are clicking on the background
    if (e.target instanceof Konva.Shape) {
      return;
    }

    useMapStore.getState().selectDrawings([]);
  }, []);

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
          variant: {
            ...bezierLine.variant,
            properties: {
              ...bezierLine.variant.properties,
              points: points,
            },
          },
        },
      ];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      executeAction(new UpdateDrawingAction(updates));
    },
    [bezierLines, executeAction],
  );

  useEffect(() => {
    if (selectedShape != DrawingShapeType.LabelText && newLabelText) {
      if (newLabelText.text.length > 0) {
        createTextLabel(newLabelText);
      }
      setNewLabelText(undefined);
    }
    if (selectedShape != DrawingShapeType.Image && newImage) {
      setNewImage(undefined);
    }
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
    useMapStore.getState().stageRef.current?.on('click.unselectDrawing', handleUnselectDrawing);
    transformerActions.addEventListener('dragend.drawings', handleMoveDrawing);
    transformerActions.addEventListener('transformend.drawings', handleTransformDrawing);

    return () => {
      useMapStore.getState().stageRef.current?.off('mousedown.startDrawing');
      useMapStore.getState().stageRef.current?.off('mousemove.draw');
      useMapStore.getState().stageRef.current?.off('mouseup.endDrawing');
      useMapStore.getState().stageRef.current?.off('mouseup.selectDrawing');
      useMapStore.getState().stageRef.current?.off('click.unselectDrawing');
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
    handleUnselectDrawing,
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
        {bezierLines.map((bezierLine, i) => {
          const properties = bezierLine.variant.properties as PolygonProperties;
          return (
            <BezierPolygon
              key={`bezier-line-${i}`}
              transformerRef={transformerRef}
              id={bezierLine.id}
              object={bezierLine}
              editMode={editDrawingId === bezierLine.id ? editMode : undefined}
              onPointsChanged={(p) => handleBezierPointsChanged(bezierLine.id, p)}
              initialPoints={properties.points}
              strokeWidth={properties.strokeWidth}
              onLineClick={handleShapeClicked}
              color={properties.color}
              fillPattern={properties.fillPattern}
              x={bezierLine.x}
              y={bezierLine.y}
              scaleX={bezierLine.scaleX}
              scaleY={bezierLine.scaleY}
              onDragStart={moveToTop}
            ></BezierPolygon>
          );
        })}

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

        {lines.map((line, i) => {
          const properties = line.variant.properties as FreeLineProperties;
          return (
            <Line
              id={line.id}
              listening={true}
              object={line}
              hitStrokeWidth={(properties.strokeWidth ? 1 : 0) + 100}
              key={i}
              x={line.x}
              y={line.y}
              scaleX={line.scaleX}
              scaleY={line.scaleY}
              points={properties.points.flat()}
              stroke={properties.color}
              fillPattern={properties.fillPattern}
              fillPa
              fill={properties.fillPattern == 'fill' ? properties.color : undefined}
              fillPatternImage={getFillPattern(properties.fillPattern, properties.color)}
              fillPatternRepeat="repeat"
              fillPatternScaleX={1 / (line.scaleX * mapScaleX)}
              fillPatternScaleY={1 / (line.scaleY * mapScaleY)}
              closed={properties.fillPattern !== 'none'}
              strokeWidth={properties.strokeWidth}
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
          );
        })}

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

        {rectangles.map((rectangle, i) => {
          const properties = rectangle.variant.properties as RectangleProperties;
          return (
            <Rect
              id={rectangle.id}
              canBeDistorted={true}
              listening={true}
              object={rectangle}
              hitStrokeWidth={properties.strokeWidth + 40}
              cornerRadius={5}
              key={`rect-${i}`}
              x={rectangle.x}
              y={rectangle.y}
              rotation={rectangle.rotation}
              width={properties.width}
              height={properties.height}
              stroke={properties.color}
              fill={properties.fillPattern == 'fill' ? properties.color : undefined}
              fillPatternImage={getFillPattern(properties.fillPattern, properties.color)}
              fillPatternScaleX={1 / (rectangle.scaleX * mapScaleX)}
              fillPatternScaleY={1 / (rectangle.scaleY * mapScaleY)}
              fillPatternRepeat="repeat"
              strokeWidth={properties.strokeWidth}
              scaleX={rectangle.scaleX}
              scaleY={rectangle.scaleY}
              onClick={handleShapeClicked}
              draggable
              onDragStart={moveToTop}
            ></Rect>
          );
        })}

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
            fill={previewRectangle.fillPattern == 'fill' ? previewRectangle.color : undefined}
            fillPatternImage={getFillPattern(previewRectangle.fillPattern, previewRectangle.color)}
            fillPatternRepeat="repeat"
            fillPatternScaleX={1 / mapScaleX}
            fillPatternScaleY={1 / mapScaleY}
          ></Rect>
        )}

        {ellipses.map((ellipse, i) => {
          const properties = ellipse.variant.properties as EllipseProperties;
          return (
            <Ellipse
              id={ellipse.id}
              listening={true}
              object={ellipse}
              canBeDistorted={true}
              key={`ellipse-${i}`}
              x={ellipse.x}
              hitStrokeWidth={properties.strokeWidth + 2}
              y={ellipse.y}
              rotation={ellipse.rotation}
              scaleX={ellipse.scaleX}
              scaleY={ellipse.scaleY}
              fillPatternScaleX={1 / (ellipse.scaleX * mapScaleX)}
              fillPatternScaleY={1 / (ellipse.scaleY * mapScaleY)}
              radiusX={properties.radiusX}
              radiusY={properties.radiusY}
              fill={properties.fillPattern == 'fill' ? properties.color : undefined}
              fillPatternImage={getFillPattern(properties.fillPattern, properties.color)}
              fillPatternRepeat="repeat"
              stroke={properties.color}
              fillPattern={properties.fillPattern}
              strokeWidth={properties.strokeWidth}
              onClick={handleShapeClicked}
              draggable
              onDragStart={moveToTop}
            ></Ellipse>
          );
        })}

        {previewEllipse && (
          <Ellipse
            key="preview-ellipse"
            x={previewEllipse.x}
            y={previewEllipse.y}
            radiusX={previewEllipse.radiusX}
            radiusY={previewEllipse.radiusY}
            stroke={previewEllipse.color}
            strokeWidth={previewEllipse.strokeWidth}
            fill={previewEllipse.fillPattern == 'fill' ? previewEllipse.color : undefined}
            fillPatternImage={getFillPattern(previewEllipse.fillPattern, previewEllipse.color)}
            fillPatternRepeat="repeat"
            fillPatternScaleX={1 / mapScaleX}
            fillPatternScaleY={1 / mapScaleY}
            fillPattern={previewEllipse.fillPattern}
          />
        )}

        {textLabels.map((text, i) => {
          const properties = text.variant.properties as LabelTextProperties;
          return (
            <EditableText
              id={text.id}
              object={text}
              x={text.x}
              y={text.y}
              text={properties.text}
              width={properties.width}
              height={properties.height}
              scaleX={text.scaleX}
              scaleY={text.scaleY}
              key={`text-${i}`}
              color={properties.color}
              isEditing={editDrawingId === text.id}
              onEndEdit={console.log}
              onChange={console.log}
              onClick={handleShapeClicked}
            ></EditableText>
          );
        })}

        {newLabelText && (
          <EditableText
            x={newLabelText.x}
            y={newLabelText.y}
            text={newLabelText.text}
            height={10}
            width={100}
            color={newLabelText.color}
            scaleX={newLabelText.scaleX}
            scaleY={newLabelText.scaleY}
            isEditing={selectedShape == DrawingShapeType.LabelText}
            onToggleEdit={console.log}
            onChange={(text) => {
              setNewLabelText({ ...newLabelText, text: text });
            }}
            onClick={handleShapeClicked}
          ></EditableText>
        )}

        {newImage && (
          <NextcloudKonvaImage
            path={newImage.path}
            scaleX={newImage.scaleX}
            scaleY={newImage.scaleY}
            x={newImage.x}
            y={newImage.y}
            opacity={0.5}
          />
        )}

        {images.map((image, i) => {
          const properties = image.variant.properties as ImageProperties;
          return (
            <NextcloudKonvaImage
              key={`image-${i}`}
              object={image}
              id={image.id}
              path={properties.path}
              scaleX={image.scaleX}
              scaleY={image.scaleY}
              x={image.x}
              y={image.y}
              onClick={handleShapeClicked}
              draggable
            />
          );
        })}
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
