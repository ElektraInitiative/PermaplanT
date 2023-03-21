import { useState } from 'react';
import { Stage, Layer, Rect, Text, Circle } from 'react-konva';

const INITIAL_STATE = {
  history: [
    {
      stage: {
        layers: [
          {
            objects: [
              {
                id: '0',
                type: 'rect',
                x: 20,
                y: 20,
                width: 50,
                height: 50,
                fill: 'black',
              },
              {
                id: '1',
                type: 'circle',
                x: 100,
                y: 100,
                fill: 'black',
                radius: 25,
              },
              {
                id: '2',
                type: 'rect',
                fill: 'red',
                x: 120,
                y: 120,
                width: 50,
                height: 50,
              },
            ],
          },
        ],
      },
    },
  ],
  historyStep: 0,
};

export const ViewDemo = () => {
  const [state, setState] = useState(INITIAL_STATE);

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
        <Layer key={index}>
          <Text text="undo" onClick={handleUndo} />
          <Text text="redo" x={40} onClick={handleRedo} />
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
      {buildStage()}
    </div>
  );
};
