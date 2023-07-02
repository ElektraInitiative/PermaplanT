import { NextcloudKonvaImage } from '@/features/map_planning/components/image/NextcloudKonvaImage';
import useMapStore from '@/features/map_planning/store/MapStore';
import { PhotoDto } from '@/features/map_planning/store/MapStoreTypes';
import { Group, Rect } from 'react-konva';

export type PhotoElementProps = {
  photo: PhotoDto;
};

export function PhotoElement({ photo }: PhotoElementProps) {
  const addShapeToTransformer = useMapStore((state) => state.addShapeToTransformer);
  const selectPhoto = useMapStore((state) => state.selectPhoto);

  const selectedPhoto = useMapStore(
    (state) => state.untrackedState.layers.photo.selectedPhoto,
  );

  return (
    <Group
      {...photo}
      photo={photo}
      draggable
      onClick={(e) => {
        addShapeToTransformer(e.currentTarget);
        selectPhoto(photo);
      }}
      onDragStart={(e) => {
        // sometimes the click event is not fired, so we have to add the object to the transformer here
        addShapeToTransformer(e.currentTarget);
      }}
    >
      <Rect
        width={photo.width}
        height={photo.height}
        x={0}
        y={0}
        fill={selectedPhoto?.id === photo.id ? '#0084ad' : '#6f9e48'}
      />
      {photo ? (
        <NextcloudKonvaImage
          path={photo.path}
          width={photo.width * 0.9}
          height={photo.height * 0.9}
          offset={{ x: (photo.width * 0.9) / 2, y: (photo.height * 0.9) / 2 }}
        />
      ) : (
        <Rect width={0} height={0} />
      )}
    </Group>
  );
}
