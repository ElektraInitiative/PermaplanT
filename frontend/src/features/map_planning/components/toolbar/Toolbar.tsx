import { ReactNode, useState } from 'react';
import { DraggableCore, DraggableEventHandler } from 'react-draggable';

const HorizontalHandle = () => (
  <div className={`horizontal-handle w-full pb-2 pt-2 hover:cursor-row-resize`}>
    <div className="h-[2px] w-full bg-neutral-700" />
  </div>
);

const VerticalHandle = ({ position }: { position: 'right' | 'left' }) => (
  <div
    className={`vertical-handle hover:cursor-col-resize ${position === 'right' ? 'pr-2' : 'pl-2'}`}
  >
    <div className="h-full w-[2px] bg-neutral-700" />
  </div>
);

export const Toolbar = ({
  contentTop,
  contentBottom,
  position,
  minWidth = 200,
}: {
  contentTop: ReactNode;
  contentBottom: ReactNode;
  position: 'left' | 'right';
  minWidth: number;
}) => {
  const [sizeState, setSizeState] = useState({ height: 300, width: 300 });

  const onResizeWidth: DraggableEventHandler = (event, data) => {
    if (position === 'right') {
      if (sizeState.width - data.deltaX > minWidth) {
        setSizeState({ height: sizeState.height, width: sizeState.width - data.deltaX });
      }
    } else {
      if (sizeState.width + data.deltaX > minWidth) {
        setSizeState({ height: sizeState.height, width: sizeState.width + data.deltaX });
      }
    }
  };
  const onResizeHeight: DraggableEventHandler = (event, data) => {
    setSizeState({ height: sizeState.height + data.deltaY, width: sizeState.width });
  };

  return (
    <div className="h-full">
      <DraggableCore
        handle=".vertical-handle"
        onStart={onResizeWidth}
        onDrag={onResizeWidth}
        onStop={onResizeWidth}
      >
        <div className="flex h-full flex-row-reverse" style={{ width: sizeState.width + 'px' }}>
          {position === 'left' && <VerticalHandle position="left" />}
          <DraggableCore
            handle=".horizontal-handle"
            onStart={onResizeHeight}
            onDrag={onResizeHeight}
            onStop={onResizeHeight}
          >
            <div className="flex flex-1 flex-col p-2">
              <div
                className="mb-4 shrink-0 overflow-y-scroll"
                style={{ height: sizeState.height + 'px' }}
              >
                {contentTop}
              </div>
              <HorizontalHandle />
              <div className="flex-shrink overflow-y-scroll">{contentBottom}</div>
            </div>
          </DraggableCore>
          {position === 'right' && <VerticalHandle position="right" />}
        </div>
      </DraggableCore>
    </div>
  );
};
