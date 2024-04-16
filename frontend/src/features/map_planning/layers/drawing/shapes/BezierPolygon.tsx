import Konva from 'konva';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Stage } from 'konva/lib/Stage';
import { range } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import React from 'react';
import { Circle, Line } from 'react-konva';
import { DrawingDto } from '@/api_types/definitions';
import useMapStore from '@/features/map_planning/store/MapStore';
import { DrawingLayerEditMode } from '@/features/map_planning/store/MapStoreTypes';
import { PolygonPoint } from '@/features/map_planning/types/PolygonTypes';
import {
  flattenRing,
  insertPointIntoLineSegmentWithLeastDistance,
} from '@/features/map_planning/utils/PolygonUtils';

export type BezierPolygonProps = {
  transformerRef?: React.MutableRefObject<Konva.Transformer | null>;
  id: string;
  editMode?: DrawingLayerEditMode;
  initialPoints: PolygonPoint[];
  onPointsChanged: (points: PolygonPoint[]) => void;
  onFinishLine?: () => void;
  onLineClick?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragStart?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
  strokeWidth: number;
  color: string;
  object?: DrawingDto;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation?: number;
  fillEnabled?: boolean;
};

function getBetweenPoint(p1: PolygonPoint, p2: PolygonPoint, p: number) {
  const x = p1.x + (p2.x - p1.x) * p;
  const y = p1.y + (p2.y - p1.y) * p;

  return { x, y } as PolygonPoint;
}

function getMidPoints(p1: PolygonPoint, p2: PolygonPoint) {
  return [getBetweenPoint(p1, p2, 0.3333), getBetweenPoint(p1, p2, 0.6666)];
}

function BezierPolygon({
  id,
  editMode,
  strokeWidth,
  color,
  initialPoints,
  onPointsChanged,
  onFinishLine,
  onLineClick,
  onDragStart,
  object,
  x,
  y,
  scaleX,
  scaleY,
  rotation,
  fillEnabled,
}: BezierPolygonProps) {
  const [points, setPoints] = useState<PolygonPoint[]>(initialPoints);
  const [, setActivePoint] = useState(-1);
  const [activeSegments, setActiveSegments] = useState<number[]>([]);
  const [, setSegPos] = useState<PolygonPoint>();

  const mapScale = useMapStore.getState().stageRef.current?.scale();

  const editModeActive = editMode != undefined;
  const drawingModeActive = editMode === 'draw';
  const removeModeActive = editMode === 'remove';
  const addModeActive = editMode === 'add';

  const lineRef = useRef<Konva.Line | null>(null);

  useEffect(() => {
    setPoints(initialPoints);
  }, [initialPoints]);

  const segments = range(Math.max(points.length / 3 - 1, 0)).map((segI) =>
    points.slice(3 * segI, 3 * segI + 4),
  );

  const isControlPoint = (pointIndex: number) => pointIndex % 3 !== 0;

  const handleAddPoint = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target.attrs.active) return;

      const stage = e.target.getStage();
      if (stage == null) return [];

      const pos = stage.getRelativePointerPosition();
      if (pos == null) return [];

      const newPoint = lineRef.current?.getTransform().invert().point({ x: pos.x, y: pos.y }) || {
        x: pos.x - x,
        y: pos.y - y,
      };

      if (!points.length) {
        onPointsChanged([newPoint]);
        return;
      }

      const lastPoint = points[points.length - 1];
      const newPoints = [...points, ...getMidPoints(lastPoint, newPoint), newPoint];

      onPointsChanged(newPoints);
    },
    [onPointsChanged, points, x, y],
  );

  const handleRightClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      e.evt.preventDefault();
      e.evt.stopPropagation();
      if (onFinishLine) {
        onFinishLine();
      }
    },
    [onFinishLine],
  );

  const addPointBetween = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (stage == null) return [];

      const pos = stage.getRelativePointerPosition();
      if (pos == null) return [];

      const polygonPointsWithoutControlPoints = points.filter((_, i) => i % 3 === 0);

      const transform = lineRef.current?.getTransform().copy();
      const scaledPolygon = polygonPointsWithoutControlPoints.map(
        (point) => transform?.point(point) || point,
      );

      const { geometry, insertedAfterIndex } = insertPointIntoLineSegmentWithLeastDistance(
        { rings: [scaledPolygon] },
        { x: pos.x, y: pos.y },
        0,
        0,
        false,
      );

      //scale newPoint to original coordinates
      let newPoint = geometry.rings[0][insertedAfterIndex + 1];
      newPoint = transform?.copy().invert().point(newPoint) || newPoint;

      //get indexes of bounding points in the original points array
      const indexOfFirstPoint = insertedAfterIndex * 3;
      const indexOfSecondPoint = insertedAfterIndex * 3 + 3;

      const newPoints = [
        ...points.slice(0, indexOfFirstPoint + 1),
        ...getMidPoints(polygonPointsWithoutControlPoints[insertedAfterIndex], newPoint),
        newPoint,
        ...getMidPoints(newPoint, polygonPointsWithoutControlPoints[insertedAfterIndex + 1]),
        ...points.slice(indexOfSecondPoint),
      ];

      onPointsChanged(newPoints);
    },
    [onPointsChanged, points],
  );

  const handleClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (addModeActive) {
        addPointBetween(e);
      } else if (drawingModeActive) {
        if (e.evt.button == 2) {
          handleRightClick(e);
        } else if (e.evt.button === 0) {
          handleAddPoint(e);
        }
      }
    },
    [addModeActive, addPointBetween, drawingModeActive, handleAddPoint, handleRightClick],
  );

  const handleDoubleClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target !== e.currentTarget) return;

      if (e.evt.button == 2) {
        e.evt.preventDefault();
        e.evt.stopPropagation();
      } else {
        handleAddPoint(e);
      }
    },
    [handleAddPoint],
  );

  const handlePointDoubleClick = (pointIndex: number) => {
    if (isControlPoint(pointIndex)) {
      flattenLine(pointIndex);
    } else {
      removePoint(pointIndex);
    }
  };

  const handleOnPointClick = (e: Konva.KonvaEventObject<MouseEvent>, pointIndex: number) => {
    if (removeModeActive) {
      removePoint(pointIndex);
    } else if (pointIndex === 0) {
      handleAddPoint(e);
    }
  };

  const handlePointMouseEnter = (pointIndex: number) => {
    const thisSegment = (pointIndex - (pointIndex % 3)) / 3;
    const activeSegments =
      pointIndex % 3 === 0 && thisSegment ? [thisSegment - 1, thisSegment] : [thisSegment];
    setActiveSegments(activeSegments);
    setActivePoint(pointIndex);
  };

  const handlePointMove = (pointIndex: number, target: Stage | Shape<ShapeConfig>) => {
    setPoints((points) => {
      const newPoints = [...points];

      newPoints[pointIndex] = lineRef.current?.getTransform().copy().invert().point({
        x: target.x(),
        y: target.y(),
      }) || {
        x: target.x(),
        y: target.y(),
      };

      return newPoints;
    });
  };

  const handlePointMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    //if click was double click then do not add point
    if (e.evt.detail === 2) return;

    onPointsChanged(points);
  };

  const handleLineMouserOver = (e: Konva.KonvaEventObject<MouseEvent>, pointIndex: number) => {
    setActiveSegments([pointIndex]);

    if (e.target.getStage() == null) return;

    const stage = e.target.getStage();
    if (stage == null) return;

    const pos = stage.getRelativePointerPosition();
    if (pos == null) return;

    setSegPos({ x: pos.x, y: pos.y });
  };

  const handleLineClick = (e: Konva.KonvaEventObject<MouseEvent>, pointIndex: number) => {
    if (editMode === 'remove') return;

    setPoints((points) => {
      const newPoints = [...points];

      if (e.target.getStage() == null) return [];

      const stage = e.target.getStage();
      if (stage == null) return [];

      const pos = stage.getRelativePointerPosition();
      if (pos == null) return [];

      const newPoint = { x: pos.x - x, y: pos.y - y };

      const spliceIndex = pointIndex * 3 + 2;
      newPoints.splice(
        spliceIndex,
        0,
        getBetweenPoint(newPoints[spliceIndex - 1], newPoint, 0.5),
        newPoint,
        getBetweenPoint(newPoint, newPoints[spliceIndex], 0.5),
      );

      return newPoints;
    });
  };

  const handleLineMouseLeave = () => {
    setActiveSegments([]);
    setSegPos(undefined);
  };

  const removePoint = (i: number) => {
    setPoints((points) => {
      const newPoints = [...points];

      const spliceIndex = i === points.length - 1 ? i - 2 : Math.max(i - 1, 0);
      newPoints.splice(spliceIndex, 3);

      onPointsChanged(newPoints);
      return newPoints;
    });

    if (i != points.length - 1) {
      flattenLine(i - 1);
    }
  };

  const flattenLine = (i: number) => {
    setPoints((points) => {
      const newPoints = [...points];

      const newIndex = i - ((i % 3) - 1);

      newPoints.splice(newIndex, 2);
      i = newIndex;

      newPoints.splice(i, 0, ...getMidPoints(newPoints[i - 1], newPoints[i]));
      onPointsChanged(newPoints);
      return newPoints;
    });
  };

  useEffect(() => {
    if (!drawingModeActive && !addModeActive) {
      return;
    }

    useMapStore.getState().stageRef.current?.on('dblclick', handleDoubleClick);
    useMapStore.getState().stageRef.current?.on('click.addPoint', handleClick);
    useMapStore.getState().stageRef.current?.on('contextmenu', handleRightClick);

    return () => {
      useMapStore.getState().stageRef.current?.off('dblclick');
      useMapStore.getState().stageRef.current?.off('click.addPoint');
      useMapStore.getState().stageRef.current?.off('contextmenu');
    };
  }, [addModeActive, drawingModeActive, handleClick, handleDoubleClick, handleRightClick]);

  return (
    <>
      {/* The curve */}
      {!editModeActive && (
        <Line
          id={id}
          onClick={onLineClick}
          points={points.length > 0 ? flattenRing(points) : []}
          stroke={color}
          strokeWidth={strokeWidth}
          hitStrokeWidth={(strokeWidth ? 1 : 0) + 100}
          lineCap={'round'}
          lineJoin={'round'}
          object={object}
          bezier
          x={x}
          y={y}
          scaleX={scaleX}
          scaleY={scaleY}
          rotation={rotation}
          fillPatternRepeat="repeat"
          draggable
          fill={color}
          fillEnabled={fillEnabled}
          closed={fillEnabled}
          onDragStart={onDragStart}
        />
      )}

      {/* Segmented dashed control line AND segmented curve */}
      {editModeActive &&
        segments.map((segment, i) => {
          const isActive = activeSegments.some((segI) => i === segI);

          const flatSegmentPoints = flattenRing(segment);

          return (
            <React.Fragment key={i}>
              {/* Curve */}
              <Line
                ref={lineRef}
                points={flatSegmentPoints}
                stroke={color}
                strokeWidth={isActive ? strokeWidth + 5 : strokeWidth}
                lineCap={'round'}
                lineJoin={'round'}
                shadowColor={'white'}
                scaleX={scaleX}
                scaleY={scaleY}
                x={x}
                y={y}
                rotation={rotation}
                active={editModeActive}
                onMouseMove={(e) => handleLineMouserOver(e, i)}
                onMouseLeave={handleLineMouseLeave}
                onClick={(e: Konva.KonvaEventObject<MouseEvent>) => {
                  handleLineClick(e, i);
                }}
                bezier
              />

              {/* Control line */}
              {drawingModeActive && (
                <Line
                  x={x}
                  y={y}
                  scaleX={scaleX}
                  scaleY={scaleY}
                  rotation={rotation}
                  points={flatSegmentPoints}
                  stroke={'#bbb'}
                  strokeWidth={2}
                  dash={[10, 10]}
                  opacity={isActive ? 1 : 0.5}
                />
              )}
            </React.Fragment>
          );
        })}

      {editModeActive &&
        points.map((p, i) => {
          const transformedPoint =
            lineRef.current?.getTransform().copy().point({ x: p.x, y: p.y }) || p;
          return (
            <Circle
              key={i}
              x={transformedPoint.x}
              y={transformedPoint.y}
              radius={5}
              scaleX={1 / (mapScale?.x || 1)}
              scaleY={1 / (mapScale?.y || 1)}
              strokeWidth={8}
              isControlElement={true}
              listening={true}
              perfectDrawEnabled={false}
              active={true}
              draggable
              onMouseUp={(e) => {
                handlePointMouseUp(e);
              }}
              onDragMove={({ target }) => {
                handlePointMove(i, target);
              }}
              onMouseEnter={() => {
                handlePointMouseEnter(i);
              }}
              onMouseLeave={() => {
                setActiveSegments([]);
                setActivePoint(-1);
              }}
              onClick={(e) => {
                handleOnPointClick(e, i);
              }}
              onDblClick={() => {
                handlePointDoubleClick(i);
              }}
              {...(i % 3
                ? {
                    stroke: '#ccc',
                    visible: drawingModeActive || addModeActive,
                  }
                : {
                    fill: i == points.length - 1 && drawingModeActive ? '#0000ff' : '#ee90aa',
                  })}
            />
          );
        })}
    </>
  );
}

export default BezierPolygon;
