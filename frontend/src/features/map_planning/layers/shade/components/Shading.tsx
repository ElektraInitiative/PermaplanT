import { Shade, ShadingDto } from '@/api_types/definitions';
import useMapStore from '@/features/map_planning/store/MapStore';
import { PolygonGeometry } from '@/features/map_planning/types/PolygonTypes';
import { flattenRing } from '@/features/map_planning/utils/PolygonUtils';
import { isUsingModifierKey } from '@/features/map_planning/utils/event-utils';
import {
  COLOR_EDITOR_HIGH_VISIBILITY,
  COLOR_LIGHT_SHADE,
  COLOR_NONE,
  COLOR_PARTIAL_SHADE,
  COLOR_PERMANENT_DEEP_SHADE,
  COLOR_PERMANENT_SHADE,
} from '@/utils/constants';
import { KonvaEventObject, Node } from 'konva/lib/Node';
import { Group, Line } from 'react-konva';

export interface ShadingProps {
  shading: ShadingDto;
}

export function Shading({ shading }: ShadingProps) {
  const geometry = shading.geometry as PolygonGeometry;
  const editorLongestSide = useMapStore((map) =>
    Math.max(map.untrackedState.editorViewRect.width, map.untrackedState.editorViewRect.height),
  );
  const shadingManipulationState = useMapStore(
    (store) => store.untrackedState.layers.shade.selectedShadingEditMode,
  );
  const selectShadings = useMapStore((store) => store.shadeLayerSelectShadings);
  const setSingleNodeInTransformer = useMapStore((store) => store.setSingleNodeInTransformer);
  const addNodeToTransformer = useMapStore((store) => store.addNodeToTransformer);
  const removeNodeFromTransformer = useMapStore((store) => store.removeNodeFromTransformer);

  const isShadingEdited = shadingManipulationState !== 'inactive';

  const removeShadingFromSelection = (e: KonvaEventObject<MouseEvent>) => {
    const selectedShadings = (foundShadings: ShadingDto[], konvaNode: Node) => {
      const shadingNode = konvaNode.getAttr('shading');
      return shadingNode ? [...foundShadings, shadingNode] : [foundShadings];
    };

    const getUpdatedShadingSelection = () => {
      const transformer = useMapStore.getState().transformer.current;
      return transformer?.nodes().reduce(selectedShadings, []) ?? [];
    };

    removeNodeFromTransformer(e.currentTarget);
    selectShadings(getUpdatedShadingSelection());
  };

  const addShadingToSelection = (e: KonvaEventObject<MouseEvent>) => {
    addNodeToTransformer(e.currentTarget);

    const currentPlantingSelection =
      useMapStore.getState().untrackedState.layers.shade.selectedShadings ?? [];
    selectShadings([...currentPlantingSelection, shading]);
  };

  const handleMultiSelect = (e: KonvaEventObject<MouseEvent>, shading: ShadingDto) => {
    isShadingElementSelected(shading) ? removeShadingFromSelection(e) : addShadingToSelection(e);
  };

  const handleSingleSelect = (e: KonvaEventObject<MouseEvent>, shading: ShadingDto) => {
    setSingleNodeInTransformer(e.currentTarget);
    selectShadings([shading]);
  };

  const handleClickOnShading = (e: KonvaEventObject<MouseEvent>) => {
    if (isShadingPlacementModeActive()) return;

    isUsingModifierKey(e) ? handleMultiSelect(e, shading) : handleSingleSelect(e, shading);
  };

  return (
    <Group shading={shading} draggable={false}>
      <Line
        onClick={handleClickOnShading}
        listening={true}
        points={flattenRing(geometry.rings[0])}
        stroke={isShadingEdited ? COLOR_EDITOR_HIGH_VISIBILITY : COLOR_NONE}
        fill={fillColorFromShadeType(shading.shade)}
        strokeWidth={editorLongestSide / 500}
        lineCap="round"
        closed={true}
        shading={shading}
      />
    </Group>
  );
}

function isShadingPlacementModeActive() {
  const selectedPlantForPlanting =
    useMapStore.getState().untrackedState.layers.shade.selectedShadeForNewShading;

  return Boolean(selectedPlantForPlanting);
}

function isShadingElementSelected(shading: ShadingDto): boolean {
  const allSelectedShadings = useMapStore.getState().untrackedState.layers.shade.selectedShadings;

  return Boolean(
    allSelectedShadings?.find((selectedPlanting) => selectedPlanting.id === shading.id),
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
