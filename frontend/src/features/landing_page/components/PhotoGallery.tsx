import IconButton from '@/components/Button/IconButton';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import '@/components/Modals/ImageModal';
import ImageModal from '@/components/Modals/ImageModal';
import { getPublicImageList } from '@/features/nextcloud_integration/api/getImages';
import { PublicNextcloudImage } from '@/features/nextcloud_integration/components/PublicNextcloudImage';
import ChevronLeftIcon from '@/svg/icons/chevron-left.svg?react';
import ChevronRightIcon from '@/svg/icons/chevron-right.svg?react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

/** Component used for the landing page to show photos from the PermaplanT public Nextcloud directory */
export const PhotoGallery = () => {
  // Nextcloud public share token for the gallery
  // used to fetch ressources from 'https://cloud.permaplant.net/s/qo6mZwPg6kFTmmj'
  const galleryShareToken = 'qo6mZwPg6kFTmmj';
  const { data: imagePaths } = useQuery(['imagePaths', galleryShareToken], () =>
    getPublicImageList(galleryShareToken),
  );

  const [selectedImage, setSelectedImage] = useState(NaN);
  const [imageSize, setImageSize] = useState('small');
  const [showModal, setShowModal] = useState(false);
  const getItemSize = (index: number) => {
    const sizes = [
      ' row-span-2 col-span-3 ',
      ' row-span-3 col-span-2 ',
      ' row-span-3 col-span-3 ',
      ' row-span-2 col-span-2 ',
    ];

    const sizeIndex = (index + 1) % 4;

    return sizes[sizeIndex];
  };

  const getAutoRows = (imageSize: string) => {
    const size = {
      small: '6vw',
      mid: '8vw',
      large: '12vw',
    }[imageSize];
    const style = {
      gridAutoRows: size ? size : '6vw',
    };
    return style;
  };

  const getGridCols = (imageSize: string) => {
    const cols = {
      large: 5,
      mid: 10,
      small: 15,
    }[imageSize];
    const style = {
      gridTemplateColumns: 'repeat(' + cols + ', 1fr)',
    };
    return style;
  };

  const gridClasses = `
      grid
      grid-flow-dense
      grid-cols-6
      gap-4
      mt-4
    `;

  return (
    <div>
      <ImageModal
        title="Image"
        body={
          <div className="flex w-full items-center justify-between">
            <IconButton
              className="m-4"
              onClick={() =>
                setSelectedImage(
                  (selectedImage - 1) % (imagePaths?.length ? imagePaths?.length : 1),
                )
              }
            >
              <ChevronLeftIcon />
            </IconButton>
            {imagePaths ? (
              <div className="h-full w-full">
                <PublicNextcloudImage
                  path={imagePaths[selectedImage]}
                  shareToken={galleryShareToken}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div>Could not load image.</div>
            )}
            <IconButton
              className="m-4"
              onClick={() =>
                setSelectedImage(
                  (selectedImage + 1) % (imagePaths?.length ? imagePaths?.length : 1),
                )
              }
            >
              <ChevronRightIcon />
            </IconButton>
          </div>
        }
        setShow={setShowModal}
        show={showModal}
        onCancel={() => {
          setShowModal(false);
        }}
      />
      <div className="mt-8 flex justify-center gap-4">
        <SimpleButton
          onClick={() => {
            setImageSize('small');
          }}
          variant={ButtonVariant.secondaryBase}
          className="w-24"
        >
          small
        </SimpleButton>
        <SimpleButton
          onClick={() => {
            setImageSize('mid');
          }}
          variant={ButtonVariant.secondaryBase}
          className="w-24"
        >
          mid
        </SimpleButton>
        <SimpleButton
          onClick={() => {
            setImageSize('large');
          }}
          variant={ButtonVariant.secondaryBase}
          className="w-24"
        >
          large
        </SimpleButton>
      </div>
      <section
        className={gridClasses}
        style={{ ...getAutoRows(imageSize), ...getGridCols(imageSize) }}
      >
        {imagePaths?.map((imagePath, index) => {
          const className =
            'w-full h-full bg-neutral-100 dark:bg-neutral-200-dark hover:bg-neutral-300 dark:hover:bg-neutral-400-dark hover:cursor-pointer rounded' +
            getItemSize(index);
          return (
            <div
              key={'image_container_' + index}
              className={className}
              onClick={() => {
                setSelectedImage(index);
                setShowModal(true);
              }}
            >
              <PublicNextcloudImage
                path={imagePath}
                shareToken={galleryShareToken}
                className="h-full w-full rounded bg-neutral-100 object-cover dark:bg-neutral-300-dark"
              />
            </div>
          );
        })}
      </section>
    </div>
  );
};
