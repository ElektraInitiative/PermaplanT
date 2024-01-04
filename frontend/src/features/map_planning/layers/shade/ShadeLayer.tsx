import { LayerType, Shade } from '@/api_types/definitions';
import { CreateShadingAction } from '@/features/map_planning/layers/shade/actions';
import { Shading } from '@/features/map_planning/layers/shade/components/Shading';
import useMapStore from '@/features/map_planning/store/MapStore';
import { typeOfLayer } from '@/features/map_planning/store/utils';
import { DEFAULT_SRID } from '@/features/map_planning/types/PolygonTypes';
import { LayerConfigWithListenerRegister } from '@/features/map_planning/types/layer-config';
import { squareGeometryAroundPoint } from '@/features/map_planning/utils/PolygonUtils';
import { Vector2d } from 'konva/lib/types';
import { useEffect } from 'react';
import { Layer } from 'react-konva';
import * as uuid from 'uuid';

type ShadeLayerProps = LayerConfigWithListenerRegister;
export function ShadeLayer({ stageListenerRegister, ...layerProps }: ShadeLayerProps) {
  const currentDateShadingDtos = useMapStore((state) => state.trackedState.layers.shade.objects);
  const shadeLayerId = useMapStore((state) => state.trackedState.layers.shade.id);
  const executeAction = useMapStore((state) => state.executeAction);
  const timelineDate = useMapStore((state) => state.untrackedState.timelineDate);
  const untrackedState = useMapStore((state) => state.untrackedState.layers.shade);
  const currentLayer = useMapStore((state) => state.untrackedState.selectedLayer);
  const shadeLayerSelectShading = useMapStore((state) => state.shadeLayerSelectShadings);
  const shadingManipulationState = useMapStore(
    (store) => store.untrackedState.layers.shade.selectedShadingEditMode,
  );

  const shadings = currentDateShadingDtos.map((dto) => (
    <Shading key={`shading-${dto.id}`} shading={dto} />
  ));

  const placeNewShading = (point: Vector2d) => {
    executeAction(
      new CreateShadingAction({
        id: uuid.v4(),
        layerId: shadeLayerId,
        addDate: timelineDate,
        shade: untrackedState.selectedShadeForNewShading ?? Shade.NoShade,
        geometry: squareGeometryAroundPoint({ ...point, srid: DEFAULT_SRID }, 400),
      }),
    );
  };

  useEffect(() => {
    stageListenerRegister.registerStageClickListener('ShadeLayer', (e) => {
      if (typeOfLayer(currentLayer) !== LayerType.Shade || shadingManipulationState !== 'inactive')
        return;

      if (untrackedState.selectedShadeForNewShading !== null) {
        placeNewShading(e.currentTarget.getRelativePointerPosition());
        return;
      }

      if (!e.target.getAttr('shading')) {
        shadeLayerSelectShading(null);
      }
    });
  }, [untrackedState.selectedShadeForNewShading, currentLayer, shadingManipulationState]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layer
      {...layerProps}
      listening={untrackedState.selectedShadeForNewShading === null && layerProps.listening}
    >
      {shadings}
    </Layer>
  );
}
