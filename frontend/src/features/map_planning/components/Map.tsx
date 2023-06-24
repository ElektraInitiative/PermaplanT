import BaseLayer from '../layers/base/BaseLayer';
import { BaseMeasurementLayer } from '../layers/base/BaseMeasurementLayer';
import BaseLayerRightToolbar from '../layers/base/components/BaseLayerRightToolbar';
import PlantsLayer from '../layers/plant/PlantsLayer';
import { PlantLayerLeftToolbar } from '../layers/plant/components/PlantLayerLeftToolbar';
import { PlantLayerRightToolbar } from '../layers/plant/components/PlantLayerRightToolbar';
import useMapStore from '../store/MapStore';
import { BaseStage } from './BaseStage';
import { Timeline } from './timeline/Timeline';
import { Layers } from './toolbar/Layers';
import { Toolbar } from './toolbar/Toolbar';
import { LayerDto, LayerType } from '@/bindings/definitions';
import IconButton from '@/components/Button/IconButton';
import { ReactComponent as RedoIcon } from '@/icons/redo.svg';
import { ReactComponent as UndoIcon } from '@/icons/undo.svg';
import { useTranslation } from 'react-i18next';

export type MapProps = {
  layers: LayerDto[];
};

/**
 * This component is responsible for rendering the map that the user is going to draw on.
 * In order to add a new layer you can add another layer file under the "layers" folder.
 * Features such as zooming and panning are handled by the BaseStage component.
 * You only have to make sure that every shape has the property "draggable" set to true.
 * Otherwise they cannot be moved.
 */
export const Map = ({ layers }: MapProps) => {
  const untrackedState = useMapStore((map) => map.untrackedState);
  const undo = useMapStore((map) => map.undo);
  const redo = useMapStore((map) => map.redo);
  const selectedLayer = useMapStore((state) => state.untrackedState.selectedLayer);

  const { t } = useTranslation(['undoRedo']);

  const getToolbarContent = (layerType: LayerType) => {
    const content = {
      [LayerType.Base]: {
        left: <div></div>,
        right: <BaseLayerRightToolbar />,
      },
      [LayerType.Plants]: { right: <PlantLayerRightToolbar />, left: <PlantLayerLeftToolbar /> },
      [LayerType.Drawing]: { right: <div></div>, left: <div></div> },
      [LayerType.Fertilization]: { right: <div></div>, left: <div></div> },
      [LayerType.Habitats]: { right: <div></div>, left: <div></div> },
      [LayerType.Hydrology]: { right: <div></div>, left: <div></div> },
      [LayerType.Infrastructure]: { right: <div></div>, left: <div></div> },
      [LayerType.Label]: { right: <div></div>, left: <div></div> },
      [LayerType.Landscape]: { right: <div></div>, left: <div></div> },
      [LayerType.Paths]: { right: <div></div>, left: <div></div> },
      [LayerType.Shade]: { right: <div></div>, left: <div></div> },
      [LayerType.Soil]: { right: <div></div>, left: <div></div> },
      [LayerType.Terrain]: { right: <div></div>, left: <div></div> },
      [LayerType.Trees]: { right: <div></div>, left: <div></div> },
      [LayerType.Warnings]: { right: <div></div>, left: <div></div> },
      [LayerType.Winds]: { right: <div></div>, left: <div></div> },
      [LayerType.Zones]: { right: <div></div>, left: <div></div> },
      [LayerType.Todo]: { right: <div></div>, left: <div></div> },
      [LayerType.Photo]: { right: <div></div>, left: <div></div> },
      [LayerType.Watering]: { right: <div></div>, left: <div></div> },
    };

    return content[layerType];
  };

  return (
    <div className="flex h-full justify-between">
      <section className="min-h-full bg-neutral-100 dark:bg-neutral-200-dark">
        <Toolbar
          minWidth={160}
          contentTop={
            <div>
              <IconButton
                className="m-2 h-8 w-8 border border-neutral-500 p-1"
                onClick={() => undo()}
                title={t('undoRedo:undo_tooltip')}
              >
                <UndoIcon></UndoIcon>
              </IconButton>
              <IconButton
                className="m-2 h-8 w-8 border border-neutral-500 p-1"
                onClick={() => redo()}
                title={t('undoRedo:redo_tooltip')}
              >
                <RedoIcon></RedoIcon>
              </IconButton>
            </div>
          }
          contentBottom={getToolbarContent(untrackedState.selectedLayer.type_).left}
          position="left"
        ></Toolbar>
      </section>
      <section className="flex h-full w-full flex-col overflow-hidden">
        <BaseStage>
          <BaseLayer
            opacity={untrackedState.layers.base.opacity}
            visible={untrackedState.layers.base.visible}
            listening={selectedLayer.type_ === LayerType.Base}
          />
          <PlantsLayer
            visible={untrackedState.layers.plants.visible}
            opacity={untrackedState.layers.plants.opacity}
            listening={selectedLayer.type_ === LayerType.Plants}
          ></PlantsLayer>
          <BaseMeasurementLayer />
        </BaseStage>
        <div className="py-2">
          <Timeline
            onSelectDate={(date) => {
              console.log(date);
            }}
          />
        </div>
      </section>
      <section className="min-h-full bg-neutral-100 dark:bg-neutral-200-dark">
        <Toolbar
          contentTop={<Layers layers={layers} />}
          contentBottom={getToolbarContent(untrackedState.selectedLayer.type_).right}
          position="right"
          minWidth={200}
        ></Toolbar>
      </section>
    </div>
  );
};
