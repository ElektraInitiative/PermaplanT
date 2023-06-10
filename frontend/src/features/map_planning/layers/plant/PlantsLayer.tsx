import useMapStore from '../../store/MapStore';
import { CreatePlantAction } from './actions';
import { PlantsSummaryDto } from '@/bindings/definitions';
import IconButton from '@/components/Button/IconButton';
import { ReactComponent as CloseIcon } from '@/icons/close.svg';
import { AnimatePresence, motion } from 'framer-motion';
import Konva from 'konva';
import { KonvaEventListener } from 'konva/lib/Node';
import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Layer } from 'react-konva';
import { Html } from 'react-konva-utils';
import { v4 as uuidv4 } from 'uuid';

interface PlantsLayerProps extends Konva.LayerConfig {
  children: JSX.Element[];
}

const PlantsLayer = ({ children, ...props }: PlantsLayerProps) => {
  const selectedPlant = useMapStore(
    (state) => state.untrackedState.layers.Plant.selectedPlantForPlanting,
  );
  const executeAction = useMapStore((state) => state.executeAction);
  const portalRef = useRef<HTMLDivElement>(
    document.getElementById('bottom-portal') as HTMLDivElement,
  );

  const handlePlanting: KonvaEventListener<Konva.Stage, unknown> = useCallback(
    (e) => {
      if (e.target instanceof Konva.Shape || !selectedPlant) {
        return;
      }

      const position = e.target.getPointerPosition();
      if (!position) {
        return;
      }

      executeAction(
        new CreatePlantAction({
          id: uuidv4(),
          plantId: selectedPlant.id,
          x: position.x,
          y: position.y,
          height: 100,
          width: 100,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        }),
      );
    },
    [executeAction, selectedPlant],
  );

  useEffect(() => {
    if (!props.listening) {
      return;
    }

    useMapStore.getState().stageRef.current?.on('click.placePlant', handlePlanting);

    return () => {
      useMapStore.getState().stageRef.current?.off('click.placePlant');
    };
  }, [props.listening, handlePlanting]);

  return (
    <Layer {...props}>
      {children}
      <Html>
        {createPortal(
          <AnimatePresence mode="wait">
            {selectedPlant && <SelectedPlantInfo plant={selectedPlant} />}
          </AnimatePresence>,
          portalRef.current,
        )}
      </Html>
    </Layer>
  );
};

const SelectedPlantInfo = ({ plant }: { plant: PlantsSummaryDto }) => {
  const selectPlant = useMapStore((state) => state.selectPlantForPlanting);

  return (
    <motion.div
      className="mb-4 flex gap-4 rounded-md bg-neutral-200 py-2 pl-6 pr-4 dark:bg-neutral-200-dark"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 100,
        transition: { delay: 0, duration: 0.1 },
      }}
      exit={{
        opacity: 0,
        transition: { delay: 0, duration: 0.1 },
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <span>
          planting {plant.unique_name} ({plant.common_name_en})
        </span>
      </div>
      <div className="flex items-center justify-center">
        <IconButton
          className="m-2 h-8 w-8 border border-neutral-500 p-1"
          onClick={() => selectPlant(null)}
        >
          <CloseIcon></CloseIcon>
        </IconButton>
      </div>
    </motion.div>
  );
};

export default PlantsLayer;
