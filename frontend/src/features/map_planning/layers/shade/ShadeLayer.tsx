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
import { LayerConfigWithListenerRegister } from '@/features/map_planning/types/layer-config';
import { squareGeometryAroundPoint } from '@/features/map_planning/utils/PolygonUtils';

type ShadeLayerProps = LayerConfigWithListenerRegister;

export function ShadeLayer({ ...layerProps }: ShadeLayerProps) {
  const currentDateShadingDtos = useMapStore((state) => state.trackedState.layers.shade.objects);
  const executeAction = useMapStore((state) => state.executeAction);
  const shadeLayerSelectShading = useMapStore((state) => state.shadeLayerSelectShadings);
  const selectedShadeForNewShading = useMapStore(
    (state) => state.untrackedState.layers.shade.selectedShadeForNewShading,
  );

  const shadings = currentDateShadingDtos.map((dto) => (
    <Shading key={`shading-${dto.id}`} shading={dto} />
  ));

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
            geometry: squareGeometryAroundPoint({ ...point, srid: DEFAULT_SRID }, 400),
          }),
        );
      }
    },
    [selectedShadeForNewShading, executeAction, shadeLayerSelectShading],
  );

  useEffect(() => {
    const stageRef = useMapStore.getState().stageRef;
    stageRef.current?.off('click.shadeLayer');
    stageRef.current?.on('click.shadeLayer', onStageClick);
  }, [onStageClick]);

  return (
    <Layer {...layerProps} listening={selectedShadeForNewShading === null && layerProps.listening}>
      {shadings}
    </Layer>
  );
}
