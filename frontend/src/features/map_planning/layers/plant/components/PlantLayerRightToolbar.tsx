import { PlantAndSeedSearch } from './PlantAndSeedSearch';
import SimpleButton from '@/components/Button/SimpleButton';
import { CreatePlantAction } from '@/features/map_planning/layers/plant/actions';
import useMapStore from '@/features/map_planning/store/MapStore';
import * as uuid from 'uuid';

export function PlantLayerRightToolbar() {
  const executeAction = useMapStore((state) => state.executeAction);
  const getSelectedLayerId = useMapStore((state) => state.getSelectedLayerId);
  const timelineDate = useMapStore((state) => state.untrackedState.timelineDate);

  return (
    <>
      <div>
        <SimpleButton
          onClick={() => {
            for (let i = 0; i < 100; i++) {
              executeAction(
                new CreatePlantAction({
                  id: uuid.v4(),
                  plantId: 5557, //Tomato
                  layerId: getSelectedLayerId() ?? -1,
                  // consider the offset of the stage and size of the element
                  x: Math.round(Math.random() * 10000 - 5000),
                  y: Math.round(Math.random() * 10000 - 5000),
                  height: 100,
                  width: 100,
                  rotation: 0,
                  scaleX: 1,
                  scaleY: 1,
                  addDate: timelineDate,
                }),
              );
            }
          }}
        >
          Generate a lot of Plants!
        </SimpleButton>
      </div>
      <PlantAndSeedSearch />
    </>
  );
}
