import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import '@/components/Modals/ImageModal';
import ImageModal from '@/components/Modals/ImageModal';
import { getPublicFileList, getPublicImage } from '@/features/nextcloud_integration/api/getImages';
import { ImageBlob } from '@/features/nextcloud_integration/components/ImageBlob';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

async function getPublicImages(imagePaths: Array<string>, publicShareToken: string) {
  return Promise.all(imagePaths.map((path) => getPublicImage(path, publicShareToken)));
}

function getImagesFromFileList(files: Array<string>) {
  return files.filter((file) => {
    // check file extension
    const parts = file.split('.');
    const extension = parts[parts.length - 1];
    return ['png', 'jpg', 'jpeg', 'svg'].includes(extension);
  });
}

export const PhotoGallery = () => {
  const publicShareToken = 'qo6mZwPg6kFTmmj';
  const { data: files } = useQuery(['files', publicShareToken], () =>
    getPublicFileList(publicShareToken),
  );

  // filter images from all files
  const imagePaths = files ? getImagesFromFileList(files) : [];

  const { data: images, isLoading: imagesLoading } = useQuery({
    queryKey: ['images', imagePaths],
    queryFn: () => getPublicImages(imagePaths as Array<string>, publicShareToken),
    enabled: !!imagePaths,
  });

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
        // body={<img src={imageUrls[selectedImage]} />}
        body={
          imagesLoading ? (
            <div>Loading...</div>
          ) : (
            images && <ImageBlob image={images[selectedImage]} />
          )
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
        {images?.map((image, index) => {
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
              <ImageBlob
                className="h-full w-full rounded bg-neutral-100 object-cover dark:bg-neutral-300-dark"
                image={image}
              ></ImageBlob>
            </div>
          );
        })}
      </section>
    </div>
  );
};
