import { ReactNode, useState, MouseEventHandler, useRef } from 'react';

interface SliderProps {
  children: Array<ReactNode> | ReactNode;
  onChange: (percentage: number) => void;
}

export const NamedSlider = (props: SliderProps) => {
  const [width, setWidth] = useState(0);
  const sliderDivRef = useRef<HTMLDivElement>(null);

  const minWidth = 0;
  const maxWidth = sliderDivRef.current ? sliderDivRef.current.clientWidth : 100

  const dragHandler: MouseEventHandler = (pointerEvent) => {
    const startWidth = width;
    const startPosition = { x: pointerEvent.pageX, y: pointerEvent.pageY };

    function onMouseMove(pointerEvent: PointerEvent) {
      if(!sliderDivRef.current) return
      const w = startWidth - startPosition.x + pointerEvent.pageX;
      const newWidth = w > minWidth ? w < maxWidth ? w : maxWidth : minWidth
      const sliderWidth = sliderDivRef.current.clientWidth
      setWidth(newWidth);
      props.onChange(newWidth / sliderWidth)
      console.log(pointerEvent.pageX)
    }
    function onMouseUp() {
      document.body.removeEventListener('pointermove', onMouseMove);
    }

    document.body.addEventListener('pointermove', onMouseMove);
    document.body.addEventListener('pointerup', onMouseUp, { once: true });
  };

  const clickHandler: MouseEventHandler = (mouseClickEvent) => {
    if(!sliderDivRef.current) return
    const newWidth = mouseClickEvent.pageX - sliderDivRef.current.offsetLeft;
    const sliderWidth = sliderDivRef.current.clientWidth
    setWidth(newWidth)
    props.onChange(newWidth / sliderWidth)
  }

  return (
    <div className="flex h-8 w-full items-center bg-neutral-500" onClick={clickHandler} ref={sliderDivRef}>
      <div className="h-full bg-primary-500" style={{width: width}}></div>
      <div className="h-full w-[6px] bg-neutral-800 hover:cursor-col-resize" onPointerDown={dragHandler}></div>
      {/* <div className="h-full w-full bg-neutral-200"></div> */}
      <span className='absolute select-none pointer-events-none'>{props.children}</span>
    </div>
  );
};
