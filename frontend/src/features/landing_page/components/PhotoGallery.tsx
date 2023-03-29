import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import '@/components/Modals/ImageModal';
import ImageModal from '@/components/Modals/ImageModal';
import { useState } from 'react';

export const PhotoGallery = () => {
  const imageUrls = [
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
  const [imageSize, setImageSize] = useState('mid');
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
      p-8 
    `;

  return (
    <div>
      <ImageModal 
        title = "Image" 
        body = {
          <img src={imageUrls[selectedImage]}/>
        } 
        setShow = {setShowModal} show = {showModal} 
        onCancel = {() => {setShowModal(false)}}
      />
      <div className="mt-8 flex justify-center gap-4">
        <SimpleButton
          onClick={() => {
            setImageSize('small');
          }}
          variant={ButtonVariant.secondary}
          className="w-24"
        >
          small
        </SimpleButton>
        <SimpleButton
          onClick={() => {
            setImageSize('mid');
          }}
          variant={ButtonVariant.secondary}
          className="w-24"
        >
          mid
        </SimpleButton>
        <SimpleButton
          onClick={() => {
            setImageSize('large');
          }}
          variant={ButtonVariant.secondary}
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
            'w-full h-full p-1 pt-4 pb-6 bg-neutral-100 dark:bg-neutral-200-dark hover:bg-neutral-300 dark:hover:bg-neutral-400-dark border-b-4 border-neutral-300 dark:border-neutral-300-dark rounded ' +
            getItemSize(index) 
          return (
            <div
              key={image + '_container'}
              className={className}
              onClick={() => {
                setSelectedImage(index)
                setShowModal(true)
              }}
            >
              <img
                src={image}
                className="h-full w-full border-white bg-neutral-100 dark:bg-neutral-300-dark object-contain"
              ></img>
            </div>
          );
        })}
      </section>
    </div>
  );
};
