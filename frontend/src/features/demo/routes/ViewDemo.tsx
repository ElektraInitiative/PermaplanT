import useFindMapsStore from '../store/FindMapsStore';
import Konva from 'konva';
import { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Circle } from 'react-konva';

interface CanvasState {
  history: {
    stage: {
      layers: {
        visible: boolean;
        objects: {
          id: string;
          type: string;
          x: number;
          y: number;
          width: number;
          height: number;
          radius: number;
        }[];
      }[];
    };
  }[];
  historyStep: number;
}

const defaultCanvasState: CanvasState = {
  history: [
    {
      stage: {
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
  const [state, setState] = useState<CanvasState>(defaultCanvasState);
  const map = useFindMapsStore((state) => state.map);
  const updateMapById = useFindMapsStore((state) => state.updateMapById);

  useEffect(() => {
    const _findMapById = async () => {
      await useFindMapsStore.getState().findMapById('1');
    };
    _findMapById();
  }, []);

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
    const id = e.target.id();
    setState((state) => {
      const history = state.history.slice(0, state.historyStep + 1);
      const historyStep = state.historyStep + 1;
      const stage = history[historyStep - 1].stage;
      const layers = stage.layers;
      const layer = layers[0];
      const objects = layer.objects;
      const object = objects.find((object) => object.id === id);
      const updatedObject = { ...object, x: e.target.x(), y: e.target.y() };
      return {
        history: [
          ...history,
          {
            stage: {
              layers: [
                {
                  objects: objects.map((object) => {
                    if (object.id === id) {
                      return updatedObject;
                    }
                    return object;
                  }),
                },
              ],
            },
          },
        ],
        historyStep,
      };
    });

    console.log(e.target);
    // setState((state) => {
    //   return {
    //     history: state.history.slice(0, state.historyStep + 1),
    //     historyStep: state.historyStep + 1,
    //   };
    // });
    // setPosition(next);
  };

  const saveStage = () => {
    updateMapById('1', {
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
          layers: [
            ...state.history[state.historyStep].stage.layers,
            {
              objects: [
                ...state.history[state.historyStep].stage.layers[0].objects,
                ...randomCircles,
              ],
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
          layers: [
            ...state.history[state.historyStep].stage.layers,
            {
              objects: [
                ...state.history[state.historyStep].stage.layers[0].objects,
                ...randomRects,
              ],
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

  // const hideLayer = (index: number) => {
  //   console.log(index);
  //   setState((state) => {
  //     return {
  //       ...state,
  //       history: [
  //         ...state.history.slice(0, state.historyStep + 1),
  //         {
  //           ...state.history[state.historyStep],
  //           stage: {
  //             layers: state.history[state.historyStep].stage.layers.map((layer, i) => {
  //               if (i === index) {
  //                 return {
  //                   ...layer,
  //                   visible: false,
  //                 };
  //               }
  //               return layer;
  //             }),
  //           },
  //         },
  //       ],
  //       historyStep: state.historyStep + 1,
  //     };
  //   });
  // };

  const buildStage = () => {
    const layers = state.history[state.historyStep].stage.layers;
    const layerObjects = layers.map((layer, index) => {
      const objects = layer.objects.map((object, object_index) => {
        switch (object.type) {
          case 'rect':
            return <Rect key={object_index} draggable onDragEnd={handleDragEnd} {...object} />;
          case 'circle':
            return <Circle key={object_index} draggable onDragEnd={handleDragEnd} {...object} />;
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
      <Stage className="bg-gray-50" width={window.innerWidth} height={window.innerHeight}>
        {layerObjects}
      </Stage>
    );
  };

  return (
    <div>
      <h1>Demo</h1>
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
        {/* <button
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={hideLayer.bind(null, 0)}
        >
          Hide rect layer
        </button> */}
      </div>
      {buildStage()}
    </div>
  );
};
