import { KonvaEventObject } from 'konva/lib/Node';
import React from 'react';
import { Text } from 'react-konva';
import { DrawingDto } from '@/api_types/definitions';
import { EditableTextInput } from './EditableTextinput';

type EditableTextProps = {
  id?: string;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  isEditing: boolean;
  onToggleEdit: (e: KonvaEventObject<MouseEvent>) => void;
  onEndEdit?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  onChange: (text: string) => void;
  text: string;
  width: number;
  height: number;
  color?: string;
  object?: DrawingDto;
};

export function EditableText({
  id,
  x,
  y,
  isEditing,
  onToggleEdit,
  onChange,
  onEndEdit,
  onClick,
  text,
  height,
  scaleX,
  scaleY,
  color,
  object,
  width,
}: EditableTextProps) {
  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.currentTarget.value);
  }

  if (isEditing) {
    return (
      <EditableTextInput
        x={x}
        y={y}
        height={height}
        scaleX={scaleX}
        scaleY={scaleY}
        value={text}
        color={color || '#000000'}
        onChange={handleTextChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEndEdit) {
            onEndEdit(e);
          }
        }}
      />
    );
  }
  return (
    <Text
      id={id}
      object={object}
      listening={true}
      x={x}
      y={y}
      width={width}
      scaleX={scaleX}
      scaleY={scaleY}
      height={height}
      text={text}
      fontSize={24}
      fontFamily="Arial"
      fill={color}
      draggable
      onDblClick={onToggleEdit}
      onClick={onClick}
    ></Text>
  );
}
