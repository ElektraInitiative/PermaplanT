import { ReactNode, useState } from 'react';
import { DraggableCore, DraggableEventHandler } from 'react-draggable';

const HorizontalHandle = () => (
  <div className={`horizontal-handle w-full pb-2 pr-2 pt-2 hover:cursor-row-resize`}>
    <div className="h-[2px] w-full bg-neutral-700" />
  </div>
);

const VerticalHandle = () => (
  <div className={`vertical-handle pr-2 hover:cursor-col-resize`}>
    <div className="h-full w-[2px] bg-neutral-700" />
  </div>
);

export const Toolbar = ({
  contentTop,
  contentBottom,
}: {
  contentTop: ReactNode;
  contentBottom: ReactNode;
}) => {
  const [sizeState, setSizeState] = useState({ height: 300, width: 300 });
  const minWidth = 200;

  const onResizeWidth: DraggableEventHandler = (event, data) => {
    if (sizeState.width - data.deltaX > minWidth) {
      setSizeState({ height: sizeState.height, width: sizeState.width - data.deltaX });
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
          <VerticalHandle />
        </div>
      </DraggableCore>
    </div>
  );
};
