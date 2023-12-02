import Konva from 'konva';
import { forwardRef } from 'react';
import { Label, Tag, Text } from 'react-konva';

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
      {/* Colors are Gray 800 and Gray 50 from the DEFAULT tailwind theme.                             */}
      {/* Unfortunately we can not directly import colors from tailwind.                               */}
      {/* More details can be found in @/features/map_planning/layers/_frontend_only/util/Constants.ts */}
      <Tag fill={'#2d2d2d'} />
      <Text text={content} fillEnabled={true} fill={'#fefefefe'} />
    </Label>
  );
});
