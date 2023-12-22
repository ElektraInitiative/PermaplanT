import { Shade, ShadingDto } from '@/api_types/definitions';
import useMapStore from '@/features/map_planning/store/MapStore';
import { PolygonGeometry } from '@/features/map_planning/types/PolygonTypes';
import { flattenRing } from '@/features/map_planning/utils/PolygonUtils';
import {
  COLOR_EDITOR_HIGH_VISIBILITY,
  COLOR_LIGHT_SHADE,
  COLOR_NONE,
  COLOR_PARTIAL_SHADE,
  COLOR_PERMANENT_DEEP_SHADE,
  COLOR_PERMANENT_SHADE,
} from '@/utils/constants';
import { Group, Line } from 'react-konva';

export function Shading(props: { shading: ShadingDto }) {
  const geometry = props.shading.geometry as PolygonGeometry;
  const editorLongestSide = useMapStore((map) =>
    Math.max(map.untrackedState.editorViewRect.width, map.untrackedState.editorViewRect.height),
  );
  const shadingManipulationState = useMapStore(
    (store) => store.untrackedState.layers.shade.selectedShadingEditMode,
  );
  const selectedShadings = useMapStore(
    (store) => store.untrackedState.layers.shade.selectedShadings,
  );

  // Editing this shading should only be possible if this shading is the only one selected.
  const isShadingSelected =
    selectedShadings !== null &&
    selectedShadings.length === 1 &&
    selectedShadings[1].id === props.shading.id;

  const isShadingEdited = isShadingSelected && shadingManipulationState !== 'inactive';

  return (
    <Group
      listening={
        isShadingSelected &&
        (shadingManipulationState === 'move' || shadingManipulationState === 'remove')
      }
    >
      <Line
        listening={true}
        points={flattenRing(geometry.rings[0])}
        stroke={isShadingEdited ? COLOR_EDITOR_HIGH_VISIBILITY : COLOR_NONE}
        fill={fillColorFromShadeType(props.shading.shade)}
        strokeWidth={editorLongestSide / 500}
        lineCap="round"
        closed={true}
      />
    </Group>
  );
}

function fillColorFromShadeType(shadeType: Shade) {
  switch (shadeType) {
    case Shade.NoShade:
      return COLOR_NONE;
    case Shade.LightShade:
      return COLOR_LIGHT_SHADE;
    case Shade.PartialShade:
      return COLOR_PARTIAL_SHADE;
    case Shade.PermanentShade:
      return COLOR_PERMANENT_SHADE;
    case Shade.PermanentDeepShade:
      return COLOR_PERMANENT_DEEP_SHADE;
  }
}
