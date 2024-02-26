import Konva from 'konva';
import { range } from 'lodash';
import { useEffect, useState } from 'react';
import React from 'react';
import { Circle, Line } from 'react-konva';
import useMapStore from '@/features/map_planning/store/MapStore';
import { DrawingDto } from '../types';

export type BezierPolygonProps = {
  transformerRef?: React.MutableRefObject<Konva.Transformer | null>;
  id: string;
  drawingModeActive: boolean;
  editModeActive: boolean;
  initialPoints: number[][];
  onPointsChanged: (points: number[][]) => void;
  onFinishLine?: () => void;
  onLineClick?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
  strokeWidth: number;
  color: string;
  object?: DrawingDto;
  x: number;
  y: number;
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
};

type Point = number[];

function getBetweenPoint(p1: Point, p2: Point, p: number) {
  const x = p1[0] + (p2[0] - p1[0]) * p;
  const y = p1[1] + (p2[1] - p1[1]) * p;

  return [x, y];
}

function getMidPoints(p1: Point, p2: Point) {
  return [getBetweenPoint(p1, p2, 0.3333), getBetweenPoint(p1, p2, 0.6666)];
}

function BezierPolygon({
  id,
  drawingModeActive,
  editModeActive,
  strokeWidth,
  color,
  initialPoints,
  onPointsChanged,
  onFinishLine,
  onLineClick,
  object,
  x,
  y,
  scaleX,
  scaleY,
  rotation,
}: BezierPolygonProps) {
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [, setActivePoint] = useState(-1);
  const [activeSegments, setActiveSegments] = useState<number[]>([]);
  const [segPos, setSegPos] = useState<Point>([]);

  useEffect(() => {
    if (points) {
      onPointsChanged(points);
    }
  }, [points]); // eslint-disable-line react-hooks/exhaustive-deps

  const segments = range(Math.max(points.length / 3 - 1, 0)).map((segI) =>
    points.slice(3 * segI, 3 * segI + 4),
  );

  const handleAddPoint = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!drawingModeActive) return;

    // if right click
    if (e.evt.button == 2) {
      e.evt.preventDefault();
      e.evt.stopPropagation();
      if (onFinishLine) {
        onFinishLine();
      }
    }

    // Only left click
    if (e.evt.button !== 0) return;

    // Must click in blank space to add a point.
    if (e.target !== e.currentTarget) return;

    if (e.target.getStage() == null) return [];

    const stage = e.target.getStage();
    if (stage == null) return [];

    const pos = stage.getRelativePointerPosition();
    if (pos == null) return [];

    setPoints((points) => {
      const newPoint = [pos.x - x, pos.y - y];

      if (!points.length) return [newPoint];

      const lastPoint = points[points.length - 1];

      return [...points, ...getMidPoints(lastPoint, newPoint), newPoint];
    });
  };

  const handleDoubleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.currentTarget) return;

    if (e.evt.button == 2) {
      e.evt.preventDefault();
      e.evt.stopPropagation();
    } else {
      handleAddPoint(e);
    }
  };

  const handleFinishDrawing = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Must click in blank space to add a point.
    if (e.target !== e.currentTarget) return;

    if (onFinishLine) {
      onFinishLine();
    }
  };

  useEffect(() => {
    if (!drawingModeActive) {
      return;
    }

    useMapStore.getState().stageRef.current?.on('dblclick.finishDrawing', handleDoubleClick);
    useMapStore.getState().stageRef.current?.on('click.addPoint', handleAddPoint);

    // do not show context menu on right click
    useMapStore.getState().stageRef.current?.on('contextmenu', (e) => {
      e.evt.preventDefault();
      e.evt.stopPropagation();
      handleFinishDrawing(e);
    });

    return () => {
      useMapStore.getState().stageRef.current?.off('dblclick.finishDrawing');
      useMapStore.getState().stageRef.current?.off('click.addPoint');
      useMapStore.getState().stageRef.current?.off('contextmenu');
    };
  }, [handleAddPoint]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* The curve */}
      {!editModeActive && (
        <Line
          id={id}
          onClick={onLineClick}
          points={points.flat()}
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
          draggable
        />
      )}
      {/* Segmented dashed control line AND segmented curve */}
      {editModeActive &&
        segments.map((segment, i) => {
          const isActive = activeSegments.some((segI) => i === segI);

          const flatSegmentPoints = segment.flat();

          return (
            <React.Fragment key={i}>
              {/* Curve */}
              <Line
                points={flatSegmentPoints}
                stroke={color}
                strokeWidth={isActive ? strokeWidth + 5 : strokeWidth}
                lineCap={'round'}
                lineJoin={'round'}
                shadowColor={'white'}
                x={x}
                y={y}
                onMouseMove={(e: Konva.KonvaEventObject<MouseEvent>) => {
                  setActiveSegments([i]);

                  if (e.target.getStage() == null) return;

                  const stage = e.target.getStage();
                  if (stage == null) return;

                  const pos = stage.getRelativePointerPosition();
                  if (pos == null) return;

                  setSegPos([pos.x, pos.y]);
                }}
                onMouseLeave={() => {
                  setActiveSegments([]);
                  setSegPos([]);
                }}
                onClick={(e: Konva.KonvaEventObject<MouseEvent>) => {
                  setPoints((points) => {
                    const newPoints = [...points];

                    if (e.target.getStage() == null) return [];

                    const stage = e.target.getStage();
                    if (stage == null) return [];

                    const pos = stage.getRelativePointerPosition();
                    if (pos == null) return [];

                    const newPoint = [pos.x, pos.y];

                    const spliceIndex = i * 3 + 2;
                    newPoints.splice(
                      spliceIndex,
                      0,
                      getBetweenPoint(newPoints[spliceIndex - 1], newPoint, 0.5),
                      newPoint,
                      getBetweenPoint(newPoint, newPoints[spliceIndex], 0.5),
                    );

                    return newPoints;
                  });
                }}
                bezier
              />

              {/* Control line */}
              <Line
                x={x}
                y={y}
                points={flatSegmentPoints}
                stroke={'#bbb'}
                strokeWidth={2}
                dash={[10, 10]}
                opacity={isActive ? 1 : 0.5}
              />
            </React.Fragment>
          );
        })}

      {editModeActive &&
        points.map((p, i) => {
          const isActive = activeSegments.some(
            (seg) => seg !== -1 && (seg === Math.floor(i / 3) || i === (seg + 1) * 3),
          );

          return (
            <Circle
              key={i}
              x={x + p[0]}
              y={y + p[1]}
              radius={5}
              isControlElement={true}
              listening={true}
              opacity={isActive ? 1 : 0.5}
              scaleX={isActive ? 1.5 : 1}
              scaleY={isActive ? 1.5 : 1}
              draggable
              {...(i % 3
                ? {
                    stroke: '#ccc',
                    strokeWidth: 10,
                  }
                : {
                    fill: i == points.length - 1 ? '#0000ff' : '#ee90aa',
                  })}
              onDragMove={({ target }) => {
                setPoints((points) => {
                  const newPoints = [...points];
                  newPoints[i] = [target.attrs.x - x, target.attrs.y - y];
                  return newPoints;
                });
              }}
              onMouseEnter={() => {
                const thisSegment = (i - (i % 3)) / 3;
                const activeSegments =
                  i % 3 === 0 && thisSegment ? [thisSegment - 1, thisSegment] : [thisSegment];
                setActiveSegments(activeSegments);
                setActivePoint(i);
              }}
              onMouseLeave={() => {
                setActiveSegments([]);
                setActivePoint(-1);
              }}
              onDblClick={() => {
                if (i % 3 && points.length >= 4) {
                  // Straight a curve segment
                  setPoints((points) => {
                    const newPoints = [...points];

                    const newI = i - ((i % 3) - 1);

                    newPoints.splice(newI, 2);
                    i = newI;

                    newPoints.splice(i, 0, ...getMidPoints(newPoints[i - 1], newPoints[i]));

                    return newPoints;
                  });
                } else {
                  // Remove point
                  setPoints((points) => {
                    const newPoints = [...points];

                    const spliceIndex = i === points.length - 1 ? i - 2 : Math.max(i - 1, 0);
                    newPoints.splice(spliceIndex, 3);

                    return newPoints;
                  });
                }
              }}
            />
          );
        })}
      {!!segPos.length && (
        <Circle
          x={x + segPos[0]}
          y={y + segPos[1]}
          radius={5}
          opacity={0.75}
          scaleX={1.5}
          scaleY={1.5}
          fill={'#ee90aa'}
          listening={false}
        />
      )}
    </>
  );
}

export default BezierPolygon;
