import { ReactNode, useState } from 'react';
import { DraggableCore, DraggableEventHandler } from 'react-draggable';

/** horizontal toolbar handle used to hide and show content */
/** includes extra padding to increase surface size */
const HorizontalHandle = () => (
  <div className={`horizontal-handle w-full pb-2 pt-2 hover:cursor-row-resize`}>
    <div className="h-[3px] w-full bg-neutral-700" />
  </div>
);

/** vertical toolbar handle used to hide and show content */
/** includes extra transparent div to increase surface size */
const VerticalHandle = () => (
  <div className={`vertical-handle relative flex hover:cursor-col-resize`}>
    <div className="h-full w-[3px] bg-neutral-700" />
    <div className={`absolute ml-[-3px] h-full w-[9px]`} />
  </div>
);

interface ToolbarProps {
  /** content that is placed in the upper part of the toolbar */
  contentTop: ReactNode;
  /** content that is placed in the lower part of the toolbar */
  contentBottom: ReactNode;
  /** position where the toolbar is intended to be on the screen */
  /** The layout is controlled by the parent but the value is needed for correctly resizing the toolbar */
  position: 'left' | 'right';
  /** Minimum width of the toolbar, can't be resized to a smaller width*/
  minWidth: number;
}

/** Toolbar with two content slots that can be used left and right of the screen */
export const Toolbar = ({ contentTop, contentBottom, position, minWidth = 200 }: ToolbarProps) => {
  const [sizeState, setSizeState] = useState({ height: 300, width: 300 });

  /** DraggableEventHandler used for resizing the width of the toolbar */
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
  /** DraggableEventHandler used for resizing the height of the top toolbar content */
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
          {position === 'left' && <VerticalHandle />}
          <DraggableCore
            handle=".horizontal-handle"
            onStart={onResizeHeight}
            onDrag={onResizeHeight}
            onStop={onResizeHeight}
          >
            <div className="flex flex-1 flex-col">
              <div
                className="mb-4 shrink-0 overflow-x-hidden overflow-y-scroll"
                style={{ height: sizeState.height + 'px' }}
              >
                {contentTop}
              </div>
              <HorizontalHandle />
              <div className="flex-shrink overflow-x-hidden overflow-y-scroll">{contentBottom}</div>
            </div>
          </DraggableCore>
          {position === 'right' && <VerticalHandle />}
        </div>
      </DraggableCore>
    </div>
  );
};
