import useMapStore from '../../store/MapStore';
import { CreatePhotoAction, MovePhotoAction, TransformPhotoAction } from './actions';
import IconButton from '@/components/Button/IconButton';
import { AnimatePresence, motion } from 'framer-motion';
import Konva from 'konva';
import { KonvaEventListener } from 'konva/lib/Node';
import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Layer } from 'react-konva';
import { Html } from 'react-konva-utils';
import * as uuid from 'uuid';
import { ReactComponent as CloseIcon } from '@/icons/close.svg';
import { PhotoElement } from './components/PhotoElement';
import { FileStat } from 'webdav';

function usePhotoLayerListeners(listening: boolean) {
  const executeAction = useMapStore((state) => state.executeAction);
  const selectedLayer = useMapStore((state) => state.untrackedState.selectedLayer);
  const selectedImageInfo = useMapStore((state) => state.untrackedState.layers.photo.selectedImageInfo);

  /**
   * Event handler for adding photos
   */
  const handleCreatePhoto: KonvaEventListener<Konva.Stage, unknown> = useCallback(
    (e) => {
      if (e.target instanceof Konva.Shape) {
        return;
      }

      const position = e.target.getRelativePointerPosition();
      if (!position) {
        return;
      }
      if(!selectedImageInfo){
        return
      }

      executeAction(
        new CreatePhotoAction({
          id: uuid.v4(),
          path: selectedImageInfo.filename,
          layerId: selectedLayer.id,
          // consider the offset of the stage and size of the element
          x: position.x - 50,
          y: position.y - 50,
          height: 100,
          width: 100,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        }),
      );
    },
    [executeAction, selectedImageInfo, selectedLayer],
  );

  /**
   * Event handler for unselecting plants
   */
  const handleUnselectPhoto: KonvaEventListener<Konva.Stage, unknown> = useCallback((e) => {
    // only unselect if we are clicking on the background
    if (e.target instanceof Konva.Shape) {
      return;
    }

    useMapStore.getState().selectPhoto(null);
  }, []);

  /**
   * Event handler for selecting photos
   */
  const handleSelectPhoto: KonvaEventListener<Konva.Stage, unknown> = useCallback(() => {
    const transformer = useMapStore.getState().transformer.current;
    const element = transformer?.getNodes().find((element) => element.getAttr('photo'));
    if (element) {
      useMapStore.getState().selectPhoto(element.getAttr('photo'));
    }
  }, []);

  /**
   * Event handler for transforming Photos
   */
  const handleTransformPhotos: KonvaEventListener<Konva.Transformer, unknown> =
    useCallback(() => {
      const updates = (useMapStore.getState().transformer.current?.getNodes() || []).map((node) => {
        return {
          id: node.id(),
          x: Math.round(node.x()),
          y: Math.round(node.y()),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
        };
      });

      executeAction(new TransformPhotoAction(updates));
    }, [executeAction]);

  /**
   * Event handler for moving plants
   */
  const handleMovePhoto: KonvaEventListener<Konva.Transformer, unknown> = useCallback(() => {
    const updates = (useMapStore.getState().transformer.current?.getNodes() || []).map((node) => {
      return {
        id: node.id(),
        x: Math.round(node.x()),
        y: Math.round(node.y()),
      };
    });

    executeAction(new MovePhotoAction(updates));
  }, [executeAction]);

  useEffect(() => {
    if (!listening) {
      return;
    }

    useMapStore.getState().stageRef.current?.on('click.placePhoto', handleCreatePhoto);
    useMapStore.getState().stageRef.current?.on('click.unselectPhoto', handleUnselectPhoto);
    useMapStore.getState().stageRef.current?.on('mouseup.selectPhoto', handleSelectPhoto);
    useMapStore.getState().transformer.current?.on('transformend.photos', handleTransformPhotos);
    useMapStore.getState().transformer.current?.on('dragend.photos', handleMovePhoto);

    return () => {
      useMapStore.getState().stageRef.current?.off('click.placePhoto');
      useMapStore.getState().stageRef.current?.off('click.unselectPhoto');
      useMapStore.getState().transformer.current?.off('transformend.photos');
      useMapStore.getState().transformer.current?.off('dragend.photos');
      useMapStore.getState().stageRef.current?.off('mouseup.selectPhoto');
    };
  }, [
    listening,
    handleCreatePhoto,
    handleTransformPhotos,
    handleMovePhoto,
    handleUnselectPhoto,
    handleSelectPhoto,
  ]);
}

type PhotoLayerProps = Konva.LayerConfig;

function PhotoLayer(props: PhotoLayerProps) {
  usePhotoLayerListeners(props.listening || false);
  const layerRef = useRef<Konva.Layer>(null);

  const trackedState = useMapStore((map) => map.trackedState);
  const selectedImageInfo = useMapStore(
    (state) => state.untrackedState.layers.photo.selectedImageInfo,
  );
  const portalRef = useRef<HTMLDivElement>(
    document.getElementById('bottom-portal') as HTMLDivElement,
  );

  return (
    <Layer {...props} ref={layerRef}>
      {trackedState.layers.photo.objects.map((o) => (
        <PhotoElement photo={o} key={o.id} />
      ))}

      <Html>
        {createPortal(
          <AnimatePresence mode="wait">
            {selectedImageInfo && <SelectedImageInfo imageInfo={selectedImageInfo} />}
          </AnimatePresence>,
          portalRef.current,
        )}
      </Html>
    </Layer>
  );
}

function SelectedImageInfo({ imageInfo }: { imageInfo: FileStat }) {
  const selectImageInfo = useMapStore((state) => state.selectImageInfo);

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
          adding photo {imageInfo.basename}
        </span>
      </div>
      <div className="flex items-center justify-center">
        <IconButton
          className="m-2 h-8 w-8 border border-neutral-500 p-1"
          onClick={() => selectImageInfo(null)}
        >
          <CloseIcon></CloseIcon>
        </IconButton>
      </div>
    </motion.div>
  );
}

export default PhotoLayer;
