import { useState } from 'react';
import { Stage, Layer, Text, Rect } from 'react-konva';

const INITIAL_STATE = {
  history: [
    {
      x: 20,
      y: 20,
    },
  ],
  historyStep: 0,
};

export const ViewDemo = () => {
  const [state] = useState(INITIAL_STATE);
  const [position, setPosition] = useState(state.history[0]);

  const handleUndo = () => {
    if (state.historyStep === 0) {
      return;
    }
    state.historyStep -= 1;
    const next = state.history[state.historyStep];
    setPosition(next);
  };

  const handleRedo = () => {
    if (state.historyStep === state.history.length - 1) {
      return;
    }
    state.historyStep += 1;
    const next = state.history[state.historyStep];
    setPosition(next);
  };

  const handleDragEnd = (e) => {
    const next = {
      x: e.target.x(),
      y: e.target.y(),
    };
    state.history = state.history.slice(0, state.historyStep + 1);
    state.history.push(next);
    state.historyStep += 1;
    setPosition(next);
  };

  return (
    <div>
      <h1>Demo</h1>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Text text="undo" onClick={handleUndo} />
          <Text text="redo" x={40} onClick={handleRedo} />
          <Rect
            x={position.x}
            y={position.y}
            width={50}
            height={50}
            fill="black"
            draggable
            onDragEnd={handleDragEnd}
          />
        </Layer>
      </Stage>
    </div>
  );
};
