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
  const switchSelection = (index: number) => {
    setSelectedImage(index === selectedImage ? NaN : index);
  };

  return (
    <section className="grid grid-flow-dense auto-rows-[6rem] grid-cols-3  gap-4 p-8 md:grid-cols-6 lg:grid-cols-12 xl:grid-cols-[repeat(24,_minmax(0,_1fr))]">
      {imageUrls.map((image, index) => {
        const span =
          index % 3 == 0
            ? 'row-span-2 col-span-3'
            : index % 4
            ? 'row-span-3 col-span-2'
            : 'row-span-2 col-span-2';
        const selectedSpan = index === selectedImage ? ' row-span-6 col-span-6 ' : '';

        const className =
          'w-full h-full p-1 pt-4 pb-6 bg-white hover:bg-stone-300 border-b-4 rounded ' +
          span +
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
  );
};
