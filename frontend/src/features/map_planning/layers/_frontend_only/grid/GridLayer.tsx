import Konva from 'konva/cmj';
import { Layer } from 'react-konva';
import { Grid } from '@/features/map_planning/layers/_frontend_only/grid/groups/Grid';
import { YardStick } from '@/features/map_planning/layers/_frontend_only/grid/groups/YardStick';
import useMapStore from '@/features/map_planning/store/MapStore';

export const GridLayer = (props: Konva.LayerConfig) => {
  const viewRect = useMapStore((state) => state.untrackedState.editorViewRect);

  return (
    <Layer listening={false} visible={props.visible} opacity={props.opacity}>
      <Grid x={viewRect.x} y={viewRect.y} width={viewRect.width} height={viewRect.height} />
      <YardStick x={viewRect.x} y={viewRect.y} width={viewRect.width} height={viewRect.height} />
    </Layer>
  );
};
