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
  const switchSelection = (index: number) => {
    setSelectedImage(index === selectedImage ? NaN : index);
  };
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

  // lookup functions are created because the classnames
  // (due to treeshaking) cannot be dynmically created.
  const getAutoRows = (rowHeight: string) => {
    return {
      small: 'auto-rows-[6vw]',
      mid: 'auto-rows-[8vw]',
      large: 'auto-rows-[12vw]',
    }[rowHeight];
  };
  const getGridCols = (cols: string) => {
    return {
      large: 'grid-cols-[repeat(5,_minmax(0,_1fr))]',
      mid: 'grid-cols-[repeat(10,_minmax(0,_1fr))]',
      small: 'grid-cols-[repeat(15,_minmax(0,_1fr))]',
    }[cols];
  };

  const gridClasses = ` 
      grid
      grid-flow-dense 
      ${getAutoRows(imageSize)}
      grid-cols-6  
      gap-4 
      p-8 
      ${getGridCols(imageSize)}
    `;

  return (
    <div>
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
      <section className={gridClasses}>
        {imageUrls.map((image, index) => {
          const selectedSpan = index === selectedImage ? ' row-span-6 col-span-6 ' : '';

          const className =
            'w-full h-full p-1 pt-4 pb-6 bg-white hover:bg-stone-300 border-b-4 rounded ' +
            getItemSize(index) +
            selectedSpan;
          return (
            <div
              key={image + '_container'}
              className={className}
              onClick={() => switchSelection(index)}
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
