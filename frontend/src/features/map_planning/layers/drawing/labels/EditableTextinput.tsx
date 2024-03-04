import { useEffect, useRef } from 'react';
import { Html } from 'react-konva-utils';

function getStyle(width: number, height: number) {
  console.log(width, height);
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  const baseStyle = {
    width: '100%',
    height: '100%',
    border: '1px solid black',
    padding: '0px',
    margin: '0px',
    background: 'none',
    outline: 'none',
    colour: 'black',
    fontSize: '24px',
    fontFamily: 'sans-serif',
  };
  if (isFirefox) {
    return baseStyle;
  }
  return {
    ...baseStyle,
    margintop: '-4px',
  };
}

type EditableTextInputProps = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  width: number;
  height: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export function EditableTextInput({
  x,
  y,
  scaleX,
  scaleY,
  value,
  onChange,
  onKeyDown,
  width,
  height,
}: EditableTextInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const style = getStyle(width, height);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Html groupProps={{ x, y, scaleX, scaleY, width, height }} divProps={{ style: { opacity: 1 } }}>
      <textarea
        ref={inputRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={style}
      />
    </Html>
  );
}
