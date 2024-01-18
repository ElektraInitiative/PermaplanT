import { KonvaEventObject, Node } from 'konva/lib/Node';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Circle, Group, Line } from 'react-konva';
import { Shade, ShadingDto } from '@/api_types/definitions';
import { UpdateShadingAction } from '@/features/map_planning/layers/shade/actions';
import useMapStore from '@/features/map_planning/store/MapStore';
import { DEFAULT_SRID, PolygonGeometry } from '@/features/map_planning/types/PolygonTypes';
import { StageListenerRegister } from '@/features/map_planning/types/layer-config';
import {
  flattenRing,
  insertPointIntoLineSegmentWithLeastDistance,
  removePointAtIndex,
  setPointAtIndex,
} from '@/features/map_planning/utils/PolygonUtils';
import { isUsingModifierKey } from '@/features/map_planning/utils/event-utils';
import { warningToastGrouped } from '@/features/toasts/groupedToast';
import { colors } from '@/utils/colors';

export interface ShadingProps {
  shading: ShadingDto;
  stageListenerRegister: StageListenerRegister;
}

export function Shading({ shading, stageListenerRegister }: ShadingProps) {
  const { t } = useTranslation('shadeLayer');
  const editorLongestSide = useMapStore((map) =>
    Math.max(map.untrackedState.editorViewRect.width, map.untrackedState.editorViewRect.height),
  );
  const shadingManipulationState = useMapStore(
    (store) => store.untrackedState.layers.shade.selectedShadingEditMode,
  );
  const selectShadings = useMapStore((store) => store.shadeLayerSelectShadings);
  const selectedShadings = useMapStore(
    (store) => store.untrackedState.layers.shade.selectedShadings,
  );
  const setSingleNodeInTransformer = useMapStore((store) => store.setSingleNodeInTransformer);
  const addNodeToTransformer = useMapStore((store) => store.addNodeToTransformer);
  const removeNodeFromTransformer = useMapStore((store) => store.removeNodeFromTransformer);
  const executeAction = useMapStore((store) => store.executeAction);

  const geometry = shading.geometry as PolygonGeometry;

  const isShadingEdited =
    shadingManipulationState !== 'inactive' &&
    selectedShadings?.length === 1 &&
    selectedShadings[0].id == shading.id;

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

    const currentShadingSelection =
      useMapStore.getState().untrackedState.layers.shade.selectedShadings ?? [];
    selectShadings([...currentShadingSelection, shading]);
  };

  const handleMultiSelect = (e: KonvaEventObject<MouseEvent>, shading: ShadingDto) => {
    isShadingElementSelected(shading) ? removeShadingFromSelection(e) : addShadingToSelection(e);
  };

  const handleSingleSelect = (e: KonvaEventObject<MouseEvent>, shading: ShadingDto) => {
    setSingleNodeInTransformer(e.currentTarget);
    selectShadings([shading]);
  };

  const handleClickOnShading = (e: KonvaEventObject<MouseEvent>) => {
    if (isShadingPlacementModeActive() || shadingManipulationState !== 'inactive') return;

    isUsingModifierKey(e) ? handleMultiSelect(e, shading) : handleSingleSelect(e, shading);
  };

  useEffect(() => {
    stageListenerRegister.registerStageClickListener(`Shading-${shading.id}`, (e) => {
      if (!isShadingEdited || shadingManipulationState !== 'add') return;

      const newPoint = {
        x: e.currentTarget.getRelativePointerPosition().x,
        y: e.currentTarget.getRelativePointerPosition().y,
        srid: DEFAULT_SRID,
      };

      const newGeometry = insertPointIntoLineSegmentWithLeastDistance(
        geometry,
        newPoint,
        editorLongestSide / 100,
      );

      executeAction(
        new UpdateShadingAction({
          id: shading.id,
          shade: shading.shade,
          geometry: newGeometry as object,
        }),
      );
    });
  }, [shadingManipulationState, isShadingEdited, shading, geometry, editorLongestSide]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePointSelect = (e: KonvaEventObject<MouseEvent>) => {
    if (shadingManipulationState === 'move') {
      setSingleNodeInTransformer(e.currentTarget, true);
      return;
    }

    if (shadingManipulationState !== 'remove') return;

    if (geometry.rings[0].length - 1 <= 3) {
      warningToastGrouped(t('edit_polygon.delete_point_forbidden'));
      return;
    }

    const index = e.currentTarget.index - 1;

    executeAction(
      new UpdateShadingAction({
        id: shading.id,
        shade: shading.shade,
        geometry: removePointAtIndex(geometry, index) as object,
      }),
    );
  };

  const handlePointDragEnd = (e: KonvaEventObject<DragEvent>) => {
    if (shadingManipulationState !== 'move') return;

    // Why is currentTarget.index always of by 1??
    const index = e.currentTarget.index - 1;

    const newPoint = {
      x: e.currentTarget.position().x,
      y: e.currentTarget.position().y,
      srid: DEFAULT_SRID,
    };

    executeAction(
      new UpdateShadingAction({
        id: shading.id,
        shade: shading.shade,
        geometry: setPointAtIndex(geometry, newPoint, index) as object,
      }),
    );
  };

  const polygonPoints = geometry.rings[0].map((point, index) => {
    if (index === geometry.rings[0].length - 1) return;

    return (
      <Circle
        index={index}
        draggable={true}
        visible={isShadingEdited}
        key={`shading-${shading.id}-point-${index}`}
        x={point.x}
        y={point.y}
        fill={colors.highlight.DEFAULT}
        radius={editorLongestSide / 200}
        onClick={(e) => handlePointSelect(e)}
        onDragStart={(e) => handlePointSelect(e)}
        onDragEnd={(e) => handlePointDragEnd(e)}
      />
    );
  });

  return (
    <Group shading={shading} draggable={false}>
      <Line
        onClick={handleClickOnShading}
        listening={true}
        points={flattenRing(geometry.rings[0])}
        stroke={isShadingEdited ? colors.highlight.DEFAULT : '#00000000'}
        fill={fillColorFromShadeType(shading.shade)}
        strokeWidth={editorLongestSide / 500}
        lineCap="round"
        closed={true}
        shading={shading}
      />
      {polygonPoints}
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
      return colors.shadings.noShade.DEFAULT;
    case Shade.LightShade:
      return colors.shadings.lightShade.DEFAULT;
    case Shade.PartialShade:
      return colors.shadings.partialShade.DEFAULT;
    case Shade.PermanentShade:
      return colors.shadings.permanentShade.DEFAULT;
    case Shade.PermanentDeepShade:
      return colors.shadings.permanentDeepShade.DEFAULT;
  }
}
