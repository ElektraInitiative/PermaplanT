import { Layers } from './Layers';
import { PlantSearch } from './PlantSearch';
import { PointerEventHandler, useState } from 'react';

export const Toolbar = () => {
  const minWidth = 200;
  const minHeight = 0;
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);

  const verticalHandler: PointerEventHandler = (event: React.PointerEvent) => {
    const startWidth = width;
    const startPosition = { x: event.pageX, y: event.pageY };

    function onPointerMove(event: PointerEvent) {
      const newWidth = startWidth + startPosition.x - event.pageX;
      setWidth(newWidth > minWidth ? newWidth : minWidth);
    }
    function onPointerUp() {
      document.body.removeEventListener('pointermove', onPointerMove);
    }

    document.body.addEventListener('pointermove', onPointerMove);
    document.body.addEventListener('pointerup', onPointerUp, { once: true });
  };

  const horizontalHandler = (event: React.PointerEvent) => {
    const startHeight = height;
    const startPosition = { x: event.pageX, y: event.pageY };

    const onPointerMove = (event: PointerEvent) => {
      const newHeight = startHeight - startPosition.y + event.pageY;
      setHeight(newHeight > minHeight ? newHeight : minHeight);
    };
    const onPointerUp = (event: PointerEvent) => {
      document.body.removeEventListener('pointermove', onPointerMove);
      const newHeight = startHeight - startPosition.y + event.pageY;
      setHeight(newHeight > minHeight ? newHeight : minHeight);
      console.log(newHeight);
    };

    document.body.addEventListener('pointermove', onPointerMove);
    document.body.addEventListener('pointerup', onPointerUp, { once: true });
  };

  return (
    <div className="flex h-full" style={{ width: width }}>
      <div
        className="h-full w-[2px] flex-none bg-neutral-500 hover:cursor-col-resize"
        onPointerDown={verticalHandler}
      ></div>
      <div className="flex flex-1 flex-col p-8">
        <div className="overflow-y-scroll" style={{ height: height }}>
          <Layers />
        </div>
        <div className="z-10 grow bg-neutral-100 dark:bg-neutral-100-dark">
          <div
            className="mb-6 h-[10px] w-full bg-neutral-500 hover:cursor-row-resize"
            onPointerDown={horizontalHandler}
          ></div>
          <PlantSearch />
        </div>
      </div>
    </div>
  );
};
