import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import '@/components/Modals/ImageModal';
import ImageModal from '@/components/Modals/ImageModal';
import { useState } from 'react';

export const PhotoGallery = () => {
  const imageUrls = [
    'https://nextcloud.markus-raab.org/nextcloud/index.php/s/CxMxEcjNWFrnma4/download/YvonneMarkl02.jpg',
    'https://nextcloud.markus-raab.org/nextcloud/index.php/s/DnDGNyPYiGa88FK/download/YvonneMarkl03.jpg',
    'https://nextcloud.markus-raab.org/nextcloud/index.php/s/mL5F4g8i7HQPixB/download/YvonneMarkl04.jpg',
    'https://nextcloud.markus-raab.org/nextcloud/index.php/s/rfpsC7CqL3aEqJQ/download/YvonneMarkl05.jpg',
    'https://nextcloud.markus-raab.org/nextcloud/index.php/s/CQiTzMGM6YXgDrF/download/YvonneMarkl06.jpg',
    '/gallery_images/permaplant_illustration_01.svg',
    '/gallery_images/permaplant_illustration_02.svg',
    '/gallery_images/permaplant_illustration_03.svg',
    '/gallery_images/permaplant_illustration_04.svg',
    '/gallery_images/permaplant_illustration_05.svg',
    '/gallery_images/permaplant_illustration_06.svg',
    '/gallery_images/permaplant_illustration_07.svg',
    '/gallery_images/permaplant_illustration_08.svg',
    '/gallery_images/permaplant_illustration_09.svg',
    '/gallery_images/permaplant_illustration_10.svg',
    '/gallery_images/permaplant_illustration_11.svg',
    '/gallery_images/permaplant_illustration_12.svg',
    '/permaplant_drawing.jpeg',
  ];
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
        body={<img src={imageUrls[selectedImage]} />}
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
        {imageUrls.map((image, index) => {
          const className =
            'w-full h-full bg-neutral-100 dark:bg-neutral-200-dark hover:bg-neutral-300 dark:hover:bg-neutral-400-dark hover:cursor-pointer rounded' +
            getItemSize(index);
          return (
            <div
              key={image + '_container'}
              className={className}
              onClick={() => {
                setSelectedImage(index);
                setShowModal(true);
              }}
            >
              <img
                src={image}
                className="h-full w-full rounded bg-neutral-100 object-contain dark:bg-neutral-300-dark"
              ></img>
            </div>
          );
        })}
      </section>
    </div>
  );
};
