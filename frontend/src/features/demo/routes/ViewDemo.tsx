import LayerList from '../components/LayerList';
import useFindMapsStore from '../store/FindMapsStore';
import { CanvasState } from '@/types';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text, Circle, Star, RegularPolygon } from 'react-konva';
import { NavLink, useParams } from 'react-router-dom';

const defaultCanvasState: CanvasState = {
  history: [
    {
      stage: {
        scaleX: 1,
        scaleY: 1,
        stageX: window.innerWidth / 2,
        stageY: window.innerHeight / 2,
        layers: [
          {
            visible: true,
            objects: [],
          },
        ],
      },
    },
  ],
  historyStep: 0,
};

export const ViewDemo = () => {
  const { id } = useParams();

  const [state, setState] = useState<CanvasState>(defaultCanvasState);
  const map = useFindMapsStore((state) => state.map);
  const updateMapById = useFindMapsStore((state) => state.updateMapById);
  const stageRef = useRef(null);

  useEffect(() => {
    if (id) {
      const _findMapById = async () => {
        await useFindMapsStore.getState().findMapById(id);
      };
      _findMapById();
    }
  }, [id]);

  useEffect(() => {
    if (map) {
      const canvasState = JSON.parse(map.detail || '');
      setState((state) => {
        return {
          ...state,
          history: [canvasState],
          historyStep: 0,
        };
      });
    }
  }, [map]);

  const handleUndo = () => {
    if (state.historyStep === 0) {
      return;
    }
    setState((state) => {
      return {
        ...state,
        historyStep: state.historyStep - 1,
      };
    });
  };

  const handleRedo = () => {
    if (state.historyStep === state.history.length - 1) {
      return;
    }
    setState((state) => {
      return {
        ...state,
        historyStep: state.historyStep + 1,
      };
    });
  };

  const handleDragEnd = (e) => {
    const id: string = e.target.id();
    const layerId: number = e.target.parent.index;
    setState((state) => {
      return {
        ...state,
        history: [
          ...state.history.slice(0, state.historyStep + 1),
          {
            ...state.history[state.historyStep],
            stage: {
              ...state.history[state.historyStep].stage,
              layers: state.history[state.historyStep].stage.layers.map((layer, index: number) => {
                if (index === layerId) {
                  return {
                    ...layer,
                    objects: layer.objects.map((object) => {
                      if (object.id === id) {
                        return {
                          ...object,
                          x: e.target.x(),
                          y: e.target.y(),
                        };
                      }
                      return object;
                    }),
                  };
                }
                return layer;
              }),
            },
          },
        ],
        historyStep: state.historyStep + 1,
      };
    });
  };

  const saveStage = () => {
    updateMapById(id, {
      detail: JSON.stringify(state.history[state.historyStep]),
    });
  };

  const generateRandomCircles = () => {
    const randomCircles = Array(1000)
      .fill(null)
      .map((_, index) => {
        return {
          id: index.toString(),
          type: 'circle',
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: 10,
          width: Math.random() * 100,
          height: Math.random() * 100,
          fill: Konva.Util.getRandomColor(),
        };
      });

    setState((state) => {
      const updatedCanvasState = {
        ...state.history[state.historyStep],
        stage: {
          ...state.history[state.historyStep].stage,
          layers: [
            ...state.history[state.historyStep].stage.layers,
            {
              visible: true,
              objects: [...randomCircles],
            },
          ],
        },
      };
      return {
        history: [...state.history, updatedCanvasState],
        historyStep: state.historyStep + 1,
      };
    });
  };

  const generateRandomRects = () => {
    const randomRects = Array(1000)
      .fill(null)
      .map((_, index) => {
        return {
          id: index.toString(),
          type: 'rect',
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: 10,
          width: 10,
          height: 10,
          fill: Konva.Util.getRandomColor(),
          stroke: Konva.Util.getRandomColor(),
          strokeWidth: 1,
        };
      });

    setState((state) => {
      const updatedCanvasState = {
        ...state.history[state.historyStep],
        stage: {
          ...state.history[state.historyStep].stage,
          layers: [
            ...state.history[state.historyStep].stage.layers,
            {
              visible: true,
              objects: [...randomRects],
            },
          ],
        },
      };
      return {
        history: [...state.history, updatedCanvasState],
        historyStep: state.historyStep + 1,
      };
    });
  };

  const incrementState = () => {
    Array(1000)
      .fill(null)
      .forEach((_) => {
        setState((state) => {
          const updatedCanvasState = {
            ...state.history[state.historyStep],
          };
          return {
            history: [...state.history, updatedCanvasState],
            historyStep: state.historyStep + 1,
          };
        });
      });
  };

  const hideLayer = (index: number) => {
    setState((state) => {
      return {
        ...state,
        history: [
          ...state.history.slice(0, state.historyStep + 1),
          {
            ...state.history[state.historyStep],
            stage: {
              ...state.history[state.historyStep].stage,
              layers: state.history[state.historyStep].stage.layers.map((layer, i) => {
                if (i === index) {
                  return {
                    ...layer,
                    visible: !layer.visible,
                  };
                }
                return layer;
              }),
            },
          },
        ],
        historyStep: state.historyStep + 1,
      };
    });
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 0.98;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();

    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setState((state) => {
      return {
        ...state,
        history: [
          ...state.history.slice(0, state.historyStep + 1),
          {
            ...state.history[state.historyStep],
            stage: {
              ...state.history[state.historyStep].stage,
              scaleX: newScale,
              scaleY: newScale,
              stageX: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
              stageY: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
            },
          },
        ],

        historyStep: state.historyStep + 1,
      };
    });
  };

  const resetZoom = () => {
    setState((state) => {
      return {
        ...state,
        history: [
          ...state.history.slice(0, state.historyStep + 1),
          {
            ...state.history[state.historyStep],
            stage: {
              ...state.history[state.historyStep].stage,
              scaleX: 1,
              scaleY: 1,
              stageX: 0,
              stageY: 0,
            },
          },
        ],

        historyStep: state.historyStep + 1,
      };
    });
  };

  const buildStage = () => {
    if (!stageRef.current) {
      return null;
    }
    const layers = state.history[state.historyStep].stage.layers;
    const layerObjects = layers.map((layer, index) => {
      const objects = layer.objects.map((object, object_index) => {
        switch (object.type) {
          case 'rect':
            return <Rect key={object_index} draggable onDragEnd={handleDragEnd} {...object} />;
          case 'circle':
            return <Circle key={object_index} draggable onDragEnd={handleDragEnd} {...object} />;
          case 'star':
            return <Star key={object_index} draggable onDragEnd={handleDragEnd} {...object} />;
          case 'regularPolygon':
            return (
              <RegularPolygon key={object_index} draggable onDragEnd={handleDragEnd} {...object} />
            );
          default:
            return;
        }
      });

      return (
        <Layer key={index} visible={layer.visible}>
          {objects}
        </Layer>
      );
    });

    return (
      <Stage
        className="bg-gray-50"
        width={stageRef.current.offsetWidth}
        height={window.innerHeight}
        onWheel={handleWheel}
        scaleX={state.history[state.historyStep].stage.scaleX}
        scaleY={state.history[state.historyStep].stage.scaleY}
        x={state.history[state.historyStep].stage.stageX}
        y={state.history[state.historyStep].stage.stageY}
      >
        {layerObjects}
      </Stage>
    );
  };

  return (
    <div>
      <h1>Demo</h1>
      <nav className="flex">
        <NavLink
          to="/demo/1"
          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          Empty canvas
        </NavLink>

        <NavLink
          to="/demo/2"
          className="ml-4 font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          3 elements
        </NavLink>

        <NavLink
          to="/demo/3"
          className="ml-4 font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          3 circles
        </NavLink>

        <NavLink
          to="/demo/4"
          className="ml-4 font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          100 circles
        </NavLink>

        <NavLink
          to="/demo/5"
          className="ml-4 font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          1000 circles
        </NavLink>
        <NavLink
          to="/demo/6"
          className="ml-4 font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          10000 circles
        </NavLink>
        <NavLink
          to="/demo/7"
          className="ml-4 font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          10000 circles(10 layers)
        </NavLink>
      </nav>
      <div>
        <button
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={saveStage}
        >
          Save
        </button>
        <button
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={generateRandomCircles}
        >
          Generate
        </button>
        <button
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={generateRandomRects}
        >
          Generate Rects
        </button>
        <button
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={handleUndo}
        >
          undo
        </button>
        <button
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={handleRedo}
        >
          redo
        </button>

        <button
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={resetZoom}
        >
          reset zoom
        </button>
        <button
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={incrementState}
        >
          increment state
        </button>
      </div>
      <div className="flex">
        <div className="w-10/12" ref={stageRef}>
          {buildStage()}
        </div>
        <div className="w-2/12">
          <p> State size:{state.history.length} </p>
          <LayerList
            layers={state.history[state.historyStep].stage.layers}
            onHideLayer={hideLayer}
          ></LayerList>
        </div>
      </div>
    </div>
  );
};
