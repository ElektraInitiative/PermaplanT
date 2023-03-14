import '@/components/Modals/ImageModal';
import ImageModal from '@/components/Modals/ImageModal';
import SimpleModal from '@/components/Modals/SimpleModal';
import { useState } from 'react';

export const PhotoGallery = () => {
  const imageUrls = [
    '/gallery_images/permaplant_illustration_01.png',
    '/gallery_images/permaplant_illustration_02.png',
    '/gallery_images/permaplant_illustration_03.png',
    '/gallery_images/permaplant_illustration_04.png',
    '/gallery_images/permaplant_illustration_05.png',
    '/gallery_images/permaplant_illustration_06.png',
    '/gallery_images/permaplant_illustration_07.png',
    '/gallery_images/permaplant_illustration_08.png',
    '/gallery_images/permaplant_illustration_09.png',
    '/gallery_images/permaplant_illustration_10.png',
    '/gallery_images/permaplant_illustration_11.png',
    '/gallery_images/permaplant_illustration_12.png',
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
        <button
          onClick={() => {
            setImageSize('small');
          }}
        >
          small
        </button>
        <button
          onClick={() => {
            setImageSize('mid');
          }}
        >
          mid
        </button>
        <button
          onClick={() => {
            setImageSize('large');
          }}
        >
          large
        </button>
      </div>
      <section
        className={gridClasses}
        style={{ ...getAutoRows(imageSize), ...getGridCols(imageSize) }}
      >
        {imageUrls.map((image, index) => {
          const className =
            'w-full h-full p-1 pt-4 pb-6 bg-white hover:bg-stone-300 border-b-4 rounded ' +
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
                className="h-full w-full border-white bg-stone-200 object-contain"
              ></img>
            </div>
          );
        })}
      </section>
    </div>
  );
};
