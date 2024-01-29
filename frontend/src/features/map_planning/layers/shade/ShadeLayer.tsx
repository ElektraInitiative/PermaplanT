import Konva from 'konva';
import { KonvaEventListener, Node } from 'konva/lib/Node';
import { Shape } from 'konva/lib/Shape';
import { Stage } from 'konva/lib/Stage';
import { Vector2d } from 'konva/lib/types';
import { useCallback, useEffect } from 'react';
import { Layer } from 'react-konva';
import * as uuid from 'uuid';
import { LayerType, Shade, ShadingDto } from '@/api_types/definitions';
import { CreateShadingAction } from '@/features/map_planning/layers/shade/actions';
import { Shading } from '@/features/map_planning/layers/shade/components/Shading';
import useMapStore from '@/features/map_planning/store/MapStore';
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

export function ShadeLayer(props: ShadeLayerProps) {
  const currentDateShadingDtos = useMapStore((state) => state.trackedState.layers.shade.objects);
  const executeAction = useMapStore((state) => state.executeAction);
  const shadeLayerSelectShading = useMapStore((state) => state.shadeLayerSelectShadings);
  const selectedShadeForNewShading = useMapStore(
    (state) => state.untrackedState.layers.shade.selectedShadeForNewShading,
  );
  const removeNodesFromTransformer = useMapStore((store) => store.removeNodesFromTransformer);

  useKeyHandlers(
    {
      Escape: stopEditingShadeLayer,
    },
    document,
    false,
    props.listening,
  );

  const shadings = currentDateShadingDtos
    .map((dto) => {
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

      return <Shading key={`${shadeIndex}-shading-${dto.id}`} shading={dto} />;
    })
    .sort((a, b) => {
      const indexA = a.key?.at(0) ?? '4';
      const indexB = b.key?.at(0) ?? '4';

      if (indexA === indexB) return 0;
      else if (indexA > indexB) return -1;
      else return 1;
    });

  removeNodesFromTransformer();

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

    const transformer = useMapStore.getState().transformer.current;
    const shadings = transformer?.nodes().reduce(selectedShadings, []);

    if (shadings?.length) {
      useMapStore.getState().shadeLayerSelectShadings(shadings);
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
        shadeLayerSelectShading(null);
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

  return (
    <Layer
      {...props}
      opacity={(props.opacity ?? 0) * 0.6}
      listening={selectedShadeForNewShading === null && props.listening}
    >
      {shadings}
    </Layer>
  );
}
