import Konva from 'konva';
import { Vector2d } from 'konva/lib/types';
import { useCallback, useEffect } from 'react';
import { Layer } from 'react-konva';
import * as uuid from 'uuid';
import { LayerType, Shade } from '@/api_types/definitions';
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

type ShadeLayerProps = Konva.LayerConfig;

export function ShadeLayer({ ...layerProps }: ShadeLayerProps) {
  const currentDateShadingDtos = useMapStore((state) => state.trackedState.layers.shade.objects);
  const executeAction = useMapStore((state) => state.executeAction);
  const shadeLayerSelectShading = useMapStore((state) => state.shadeLayerSelectShadings);
  const selectedShadeForNewShading = useMapStore(
    (state) => state.untrackedState.layers.shade.selectedShadeForNewShading,
  );

  useKeyHandlers(
    {
      Escape: stopEditingShadeLayer,
    },
    document,
    false,
    layerProps.listening,
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

  const onStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const currentLayer = useMapStore.getState().untrackedState.selectedLayer;
      const shadingManipulationState =
        useMapStore.getState().untrackedState.layers.shade.selectedShadingEditMode;
      const shadeLayerId = useMapStore.getState().trackedState.layers.shade.id;
      const timelineDate = useMapStore.getState().untrackedState.timelineDate;

      if (
        typeOfLayer(currentLayer) !== LayerType.Shade ||
        shadingManipulationState !== 'inactive'
      ) {
        return;
      }

      if (selectedShadeForNewShading !== null) {
        placeNewShading(e.currentTarget.getRelativePointerPosition());
        return;
      }

      if (!e.target.getAttr('shading')) {
        shadeLayerSelectShading(null);
      }

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
    [selectedShadeForNewShading, executeAction, shadeLayerSelectShading],
  );

  useEffect(() => {
    const stageRef = useMapStore.getState().stageRef;
    stageRef.current?.on('click.shadeLayer', onStageClick);

    return () => {
      stageRef.current?.off('click.shadeLayer');
    };
  }, [onStageClick]);

  return (
    <Layer
      {...layerProps}
      opacity={(layerProps.opacity ?? 0) * 0.6}
      listening={selectedShadeForNewShading === null && layerProps.listening}
    >
      {shadings}
    </Layer>
  );
}
