import { Grid } from '@/features/map_planning/layers/_frontend_only/grid/groups/Grid';
import { YardStick } from '@/features/map_planning/layers/_frontend_only/grid/groups/YardStick';
import useMapStore from '@/features/map_planning/store/MapStore';
import Konva from 'konva/cmj';
import { Group } from 'react-konva';

export const GridLayer = (props: Konva.LayerConfig) => {
  const mapBounds = useMapStore((state) => state.untrackedState.editorBounds);

  return (
    <Group listening={false} visible={props.visible} opacity={props.opacity}>
      <Grid x={mapBounds.x} y={mapBounds.y} width={mapBounds.width} height={mapBounds.height} />
      <YardStick
        x={mapBounds.x}
        y={mapBounds.y}
        width={mapBounds.width}
        height={mapBounds.height}
      />
    </Group>
  );
};
