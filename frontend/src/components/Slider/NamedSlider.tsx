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
  // width in percentage
  const [width, setWidth] = useState(0);
  const sliderDivRef = useRef<HTMLDivElement>(null);

  // bind value to slider fill width
  useEffect(() => {
    if (props.value) {
      setWidth(props.value);
    }
  }, [props.value]);

  /** keybinding for changing the value */
  const keybindings = {
    valueUp: ['k', 'ArrowRight'],
    valueDown: ['j', 'ArrowLeft'],
  };

  /** bind value to a min and max value */
  const boundValue = (min: number, max: number, value: number) =>
    value > min ? (value < max ? value : max) : min;

  const dragHandler: MouseEventHandler = (pointerEvent) => {
    const startPosition = { x: pointerEvent.pageX, y: pointerEvent.pageY };
    const maxPixelWidth = sliderDivRef.current ? sliderDivRef.current.clientWidth : 100;

    function onMouseMove(pointerEvent: PointerEvent) {
      if (!sliderDivRef.current) return;
      const diffPercentage = (startPosition.x - pointerEvent.pageX) / maxPixelWidth;
      const newWidth = boundValue(0, 1, width - diffPercentage);
      setWidth(newWidth);
      props.onChange(newWidth);
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
    // calculate new witdh in pixel
    const pixelWidth = mouseClickEvent.pageX - offsetLeft;
    const sliderWidth = sliderDivRef.current.clientWidth;
    setWidth(pixelWidth / sliderWidth);
    props.onChange(pixelWidth / sliderWidth);
  };

  /** adds the given value to the current slider value */
  /** the slider value is float between 0 and 1 */
  const changePercentage = (value: number) => {
    const newValue = boundValue(0, 1, width + value);
    setWidth(newValue);
    props.onChange(newValue);
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
      <div
        className="h-full bg-secondary-100 dark:bg-secondary-600"
        style={{ width: width * 100 + '%' }}
      ></div>
      <div
        className="h-full w-[4px] bg-secondary-500 hover:cursor-col-resize"
        onPointerDown={dragHandler}
      ></div>
      <span className="pointer-events-none absolute ml-2 select-none">{props.children}</span>
    </div>
  );
};
