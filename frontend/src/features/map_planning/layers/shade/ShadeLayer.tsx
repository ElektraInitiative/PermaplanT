import Konva from 'konva';
import { KonvaEventListener, Node } from 'konva/lib/Node';
import { Shape } from 'konva/lib/Shape';
import { Stage } from 'konva/lib/Stage';
import { Vector2d } from 'konva/lib/types';
import { useCallback, useEffect, useRef } from 'react';
import { Layer } from 'react-konva';
import * as uuid from 'uuid';
import { LayerType, Shade, ShadingDto } from '@/api_types/definitions';
import { CreateShadingAction } from '@/features/map_planning/layers/shade/actions';
import { Shading } from '@/features/map_planning/layers/shade/components/Shading';
import useMapStore from '@/features/map_planning/store/MapStore';
import { useTransformerStore } from '@/features/map_planning/store/transformer/TransformerStore';
import { typeOfLayer } from '@/features/map_planning/store/utils';
import { DEFAULT_SRID } from '@/features/map_planning/types/PolygonTypes';
import { ringGeometryAroundPoint } from '@/features/map_planning/utils/PolygonUtils';
import { useKeyHandlers } from '@/hooks/useKeyHandlers';

function stopEditingShadeLayer() {
  useMapStore.getState().shadeLayerSelectShadeForNewShading(null);
  useMapStore.getState().shadeLayerDeactivatePolygonManipulation();
  useMapStore.getState().clearStatusPanelContent();
}

function isShading(obj: Stage | Shape | Node) {
  return obj.getAttr('shading') || obj.parent?.getAttr('shading');
}

type ShadeLayerProps = Konva.LayerConfig;

type ShadingRef = {
  id: string;
  ref: Konva.Line;
};

export function ShadeLayer(props: ShadeLayerProps) {
  const currentDateShadingDtos = useMapStore((state) => state.trackedState.layers.shade.objects);
  const executeAction = useMapStore((state) => state.executeAction);
  const shadeLayerSelectShading = useMapStore((state) => state.shadeLayerSelectShadings);
  const selectedShadeForNewShading = useMapStore(
    (state) => state.untrackedState.layers.shade.selectedShadeForNewShading,
  );

  const shadingRefs = useRef<Array<ShadingRef>>([]);
  shadingRefs.current = []; // Old shading refs become invalid once this component is rerendered.

  useKeyHandlers(
    {
      Escape: stopEditingShadeLayer,
    },
    document,
    false,
    props.listening,
  );

  const shadings = currentDateShadingDtos
    .map((dto, i) => {
      // We sort all shadings such that darker shading values are always on top.
      let shadeIndex;
      switch (dto.shade) {
        case Shade.LightShade:
          shadeIndex = 3;
          break;

        case Shade.PartialShade:
          shadeIndex = 2;
          break;

        case Shade.PermanentShade:
          shadeIndex = 1;
          break;

        case Shade.PermanentDeepShade:
          shadeIndex = 0;
          break;

        default:
          shadeIndex = 4;
          break;
      }

      return (
        <Shading
          ref={(ref) => {
            if (ref && shadingRefs?.current) shadingRefs.current[i] = { ref, id: dto.id };
          }}
          key={`${shadeIndex}-shading-${dto.id}`}
          shading={dto}
        />
      );
    })
    .sort((a, b) => {
      const indexA = a.key?.at(0) ?? '4';
      const indexB = b.key?.at(0) ?? '4';

      if (indexA === indexB) return 0;
      else if (indexA > indexB) return -1;
      else return 1;
    });

  const handlePlaceShading = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const currentLayer = useMapStore.getState().untrackedState.selectedLayer;
      const shadingManipulationState =
        useMapStore.getState().untrackedState.layers.shade.selectedShadingEditMode;
      const shadeLayerId = useMapStore.getState().trackedState.layers.shade.id;
      const timelineDate = useMapStore.getState().untrackedState.timelineDate;

      if (
        typeOfLayer(currentLayer) !== LayerType.Shade ||
        shadingManipulationState !== 'inactive' ||
        selectedShadeForNewShading === null
      ) {
        return;
      }

      placeNewShading(e.currentTarget.getRelativePointerPosition());

      function placeNewShading(point: Vector2d) {
        executeAction(
          new CreateShadingAction({
            id: uuid.v4(),
            layerId: shadeLayerId,
            addDate: timelineDate,
            shade: selectedShadeForNewShading ?? Shade.NoShade,
            geometry: ringGeometryAroundPoint({ ...point, srid: DEFAULT_SRID }, 8, 200),
          }),
        );
      }
    },
    [selectedShadeForNewShading, executeAction],
  );

  const handleSelectShading: KonvaEventListener<Konva.Stage, MouseEvent> = useCallback(() => {
    const currentLayer = useMapStore.getState().untrackedState.selectedLayer;
    const shadingManipulationState =
      useMapStore.getState().untrackedState.layers.shade.selectedShadingEditMode;

    if (
      typeOfLayer(currentLayer) !== LayerType.Shade ||
      shadingManipulationState !== 'inactive' ||
      selectedShadeForNewShading !== null
    ) {
      return;
    }

    const selectedShadings = (foundPlantings: ShadingDto[], konvaNode: Node) => {
      const shadingNode = isShading(konvaNode);
      return shadingNode ? [...foundPlantings, shadingNode] : [foundPlantings];
    };

    const shadings = useTransformerStore
      .getState()
      .actions.getSelection()
      .reduce(selectedShadings, []);

    if (shadings?.length) {
      useMapStore.getState().shadeLayerSelectShadings(shadings, useTransformerStore.getState());
    }
  }, [selectedShadeForNewShading]);

  const handleUnselectShading = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const currentLayer = useMapStore.getState().untrackedState.selectedLayer;
      const shadingManipulationState =
        useMapStore.getState().untrackedState.layers.shade.selectedShadingEditMode;

      if (
        typeOfLayer(currentLayer) !== LayerType.Shade ||
        shadingManipulationState !== 'inactive' ||
        selectedShadeForNewShading !== null
      ) {
        return;
      }

      if (!isShading(e.target)) {
        shadeLayerSelectShading(null, useTransformerStore.getState());
      }
    },
    [selectedShadeForNewShading, shadeLayerSelectShading],
  );

  useEffect(() => {
    if (!props.listening) {
      return;
    }

    useMapStore.getState().stageRef.current?.on('click.placeShading', handlePlaceShading);
    useMapStore.getState().stageRef.current?.on('click.unselectShading', handleUnselectShading);
    useMapStore.getState().stageRef.current?.on('mouseup.selectShading', handleSelectShading);

    return () => {
      useMapStore.getState().stageRef.current?.off('click.placeShading');
      useMapStore.getState().stageRef.current?.off('click.unselectShading');
      useMapStore.getState().stageRef.current?.off('mouseup.selectShading');
    };
  }, [handlePlaceShading, handleSelectShading, handleUnselectShading, props.listening]);

  /*
    This is an ugly workaround for a pretty annoying bug involving the Konva transformer.

    The problem:
    Updating a shade value using ShadeLayerLeftToolbar causes a rerender of the corresponding shading component.
    Since this causes all affected shading components to be replaced by new React nodes, the Konva transformer looses
    all references to previously selected shadings.

    In simpler therms this means that the selection rectangle either disappears or becomes completely screwed up
    every time the user changes a shadings shade value.

    The solution:
    Manually reset the transformer after each rerender of the shade layer.
  */
  useEffect(
    () => {
      const selectedShadings = useMapStore.getState().untrackedState.layers.shade.selectedShadings;

      const isSelected = (id: string) => {
        return Boolean(selectedShadings?.find((shading) => shading.id === id));
      };

      const filteredShadingRefs = shadingRefs.current
        ?.filter((ref) => isSelected(ref.id))
        .map((ref) => ref.ref);

      useTransformerStore.getState().actions.removeAllNodesFromSelection();
      useTransformerStore
        .getState()
        .actions.replaceNodesInSelectionSelection(filteredShadingRefs ?? []);
    },
    // For some reason using only shadingRefs is not enough to detect changes made to shadingRefs.current
    [shadingRefs.current], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <Layer
      {...props}
      opacity={props.opacity ?? 0}
      listening={selectedShadeForNewShading === null && props.listening}
    >
      {shadings}
    </Layer>
  );
}
