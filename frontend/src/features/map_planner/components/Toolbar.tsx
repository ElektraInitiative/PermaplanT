import { Layers } from './Layers';
import { MouseEventHandler, useState } from 'react';

export const Toolbar = () => {
  const minWidth = 200
  const [width, setWidth] = useState(minWidth);

  const handler: MouseEventHandler = (mouseDownEvent) => {
    const startWidth = width;
    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

    function onMouseMove(mouseMoveEvent: MouseEvent) {
      const newWidth = startWidth + startPosition.x - mouseMoveEvent.pageX
      setWidth(newWidth > minWidth ? newWidth : minWidth);
    }
    function onMouseUp() {
      document.body.removeEventListener('mousemove', onMouseMove);
    }

    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp, { once: true });
  };

  return (
    <div className="flex h-full" style={{ width: width }}>
      <div className="h-full w-[2px] flex-none bg-neutral-500 hover:cursor-col-resize" onMouseDown={handler}></div>
      <div className="p-4 flex-1">
        <Layers />
      </div>
    </div>
  );
};
