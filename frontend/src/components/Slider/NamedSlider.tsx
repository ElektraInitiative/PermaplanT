import { ReactNode, useState, MouseEventHandler, useRef, KeyboardEventHandler } from 'react';

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

  const changePercentage = (value: number) => {
      if(!sliderDivRef.current) return 0
      const sliderWidth = sliderDivRef.current.clientWidth
      const p = width/sliderWidth + sliderWidth * value / 100
      console.log(width, sliderWidth, p)
      const percentage = p > 1 ? 1 : p < 0 ? 0 : p
      console.log(percentage)
      setWidth(percentage * sliderWidth)
      props.onChange(percentage)
  }

  const keyDownHandler: KeyboardEventHandler = (event) => {
    if(event.key === 'j' || event.key === "ArrowUp"){
      changePercentage(0.05)
    }
    else if(event.key === 'k' || event.key === "ArrowDown"){
      changePercentage(-0.05)
    }
  }

  return (
    <div className="flex h-8 w-full items-center bg-neutral-500" tabIndex={0} onClick={clickHandler} ref={sliderDivRef} onKeyDown={keyDownHandler}>
      <div className="h-full bg-secondary-400 dark:bg-secondary-700" style={{width: width}}></div>
      <div className="h-full w-[4px] bg-secondary-800 hover:cursor-col-resize" onPointerDown={dragHandler}></div>
      <span className='absolute select-none pointer-events-none ml-2'>{props.children}</span>
    </div>
  );
};
