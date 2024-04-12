import Konva from 'konva';
import { forwardRef } from 'react';
import { Label, Tag, Text } from 'react-konva';
import { colors } from '@/utils/colors';

export interface MapLabelProps extends React.ComponentProps<typeof Label> {
  content: string;
}

export const MapLabel = forwardRef<Konva.Label, MapLabelProps>(function MapLabel(
  props: MapLabelProps,
  ref,
) {
  const { content, ...labelProps } = props;

  return (
    <Label ref={ref} {...labelProps}>
      <Tag fill={colors.gray[800]} />
      <Text text={content} fillEnabled={true} fill={colors.gray[50]} />
    </Label>
  );
});
