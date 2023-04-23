import { BaseStage } from '../components/BaseStage';
import PlantsLayer from '../layers/PlantsLayer';
import useMapState from '@/features/undo_redo';
import { Rect } from 'react-konva';

/**
 * This component is responsible for rendering the map that the user is going to draw on.
 * In order to add a new layer you can add another layer file under the "layers" folder.
 * Features such as zooming and panning are handled by the BaseStage component.
 * You only have to make sure that every shape has the property "draggable" set to true.
 * Otherwise they cannot be moved.
 */
export const Map = () => {
  const state = useMapState((state) => state.state);
  const dispatch = useMapState((s) => s.dispatch);

  return (
    <BaseStage>
      <PlantsLayer>
        {state.layers['plant'].objects.map((o) => (
          <Rect
            {...o}
            key={o.id}
            fill="blue"
            draggable={true}
            shadowBlur={5}
            onDragEnd={(e) =>
              dispatch({
                type: 'OBJECT_UPDATE',
                payload: {
                  ...o,
                  x: e.target.x(),
                  y: e.target.y(),
                  height: e.target.height(),
                  width: e.target.width(),
                },
              })
            }
            onTransformEnd={(e) => {
              dispatch({
                type: 'OBJECT_UPDATE',
                payload: {
                  ...o,
                  x: e.target.x(),
                  y: e.target.y(),
                  rotation: e.target.rotation(),
                  scaleX: e.target.scaleX(),
                  scaleY: e.target.scaleY(),
                },
              });
            }}
          />
        ))}
      </PlantsLayer>
    </BaseStage>
  );
};
