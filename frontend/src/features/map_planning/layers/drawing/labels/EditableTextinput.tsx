import { useEffect, useRef } from 'react';
import { Html } from 'react-konva-utils';

function getStyle(color: string) {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  const baseStyle = {
    width: 'fit-content',
    height: '100%',
    border: '1px solid black',
    padding: '0px',
    margin: '0px',
    background: 'none',
    outline: 'none',
    color: color,
    fontSize: '24px',
    fontFamily: 'sans-serif',
    resize: 'both',
  };
  if (isFirefox) {
    return baseStyle;
  }
  return {
    ...baseStyle,
    margintop: '-4px',
  };
}

interface EditableTextInputProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  height: number;
  value: string;
  color: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function EditableTextInput({
  x,
  y,
  scaleX,
  scaleY,
  value,
  onChange,
  onKeyDown,
  height,
  color,
  ...props
}: EditableTextInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const style = getStyle(color);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Html groupProps={{ x, y, scaleX, scaleY, height }} divProps={{ style: { opacity: 1 } }}>
      <textarea
        ref={inputRef}
        value={value}
        {...props}
        onChange={onChange}
        onKeyDown={onKeyDown}
        rows={1}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        style={style}
      />
    </Html>
  );
}
