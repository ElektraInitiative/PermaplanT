import {
  ReactNode,
  useState,
  MouseEventHandler,
  useRef,
  KeyboardEventHandler,
  useEffect,
} from 'react';

interface SliderProps {
  /** children passed to the slider appear in the Slider */
  children: Array<ReactNode> | ReactNode;
  /** onChange event is triggered whenever the current percentage value of the slider changes */
  onChange: (percentage: number) => void;
  /** value can be used to set the value of the Slider */
  /** must be between 0 and 1 */
  value?: number;
  /** sets the title attribute for the outer div */
  title: string;
}

/**
 * A Slider with a label which can be controlled by dragging, clicking, arrow left/right and j/k.
 */
export const NamedSlider = (props: SliderProps) => {
  const [width, setWidth] = useState(0);
  const sliderDivRef = useRef<HTMLDivElement>(null);

  const minWidth = 0;
  const maxWidth = sliderDivRef.current ? sliderDivRef.current.clientWidth : 100;

  // bind value to slider fill width
  useEffect(() => {
    if (props.value) {
      const w = props.value * maxWidth;
      const newWidth = w > minWidth ? (w < maxWidth ? w : maxWidth) : minWidth;
      setWidth(newWidth);
    }
  }, [props.value, maxWidth]);

  /** keybinding for changing the value */
  const keybindings = {
    valueUp: ['k', 'ArrowRight'],
    valueDown: ['j', 'ArrowLeft'],
  };

  const dragHandler: MouseEventHandler = (pointerEvent) => {
    const startWidth = width;
    const startPosition = { x: pointerEvent.pageX, y: pointerEvent.pageY };

    function onMouseMove(pointerEvent: PointerEvent) {
      if (!sliderDivRef.current) return;
      const w = startWidth - startPosition.x + pointerEvent.pageX;
      const newWidth = w > minWidth ? (w < maxWidth ? w : maxWidth) : minWidth;
      const sliderWidth = sliderDivRef.current.clientWidth;
      setWidth(newWidth);
      props.onChange(newWidth / sliderWidth);
    }
    function onMouseUp() {
      document.body.removeEventListener('pointermove', onMouseMove);
    }

    document.body.addEventListener('pointermove', onMouseMove);
    document.body.addEventListener('pointerup', onMouseUp, { once: true });
  };

  const clickHandler: MouseEventHandler = (mouseClickEvent) => {
    if (!sliderDivRef.current) return;
    const offsetLeft = sliderDivRef.current.getBoundingClientRect().left;
    const newWidth = mouseClickEvent.pageX - offsetLeft;
    const sliderWidth = sliderDivRef.current.clientWidth;
    setWidth(newWidth);
    props.onChange(newWidth / sliderWidth);
  };

  /** adds the given value to the current slider value */
  /** the slider value is float between 0 and 1 */
  const changePercentage = (value: number) => {
    if (!sliderDivRef.current) return 0;
    const sliderWidth = sliderDivRef.current.clientWidth;
    const p = width / sliderWidth + (sliderWidth * value) / sliderWidth;
    const percentage = p > 1 ? 1 : p < 0 ? 0 : p;
    setWidth(percentage * sliderWidth);
    props.onChange(percentage);
  };

  /** increases or decreases the slider value when one of the corresponding keys defined in keybindings are pressed */
  const keyDownHandler: KeyboardEventHandler = (event) => {
    if (keybindings.valueUp.includes(event.key)) {
      changePercentage(0.05);
    } else if (keybindings.valueDown.includes(event.key)) {
      changePercentage(-0.05);
    }
  };

  return (
    <div
      className="relative flex h-8 w-full items-center bg-neutral-200 dark:bg-neutral-100-dark"
      tabIndex={0}
      onClick={clickHandler}
      ref={sliderDivRef}
      onKeyDown={keyDownHandler}
      title={props.title}
    >
      <div className="h-full bg-secondary-100 dark:bg-secondary-600" style={{ width: width }}></div>
      <div
        className="h-full w-[4px] bg-secondary-500 hover:cursor-col-resize"
        onPointerDown={dragHandler}
      ></div>
      <span className="pointer-events-none absolute ml-2 select-none">{props.children}</span>
    </div>
  );
};
