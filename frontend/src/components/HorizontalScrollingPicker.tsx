import React, { useRef, useState, useEffect } from 'react';

interface HorizontalScrollingPickerProps {
  items: string[];
  onChange: (newValue: string) => void;
  value?: string;
}

const HorizontalScrollingPicker: React.FC<HorizontalScrollingPickerProps> = (props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedItem /*, setSelectedItem*/] = useState<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number | null>(null);
  const leftScrollStart = useRef<number | null>(null);

  const scrollToIndex = (idx: number) => {
    const container = containerRef.current;
    if (container) {
      const items = container.getElementsByClassName('item') as HTMLCollectionOf<HTMLElement>;
      const selectedElement = items[idx];

      if (selectedElement) {
        const containerWidth = container.offsetWidth;
        const itemWidth = selectedElement.offsetWidth;
        const scrollLeft = selectedElement.offsetLeft + itemWidth / 2 - containerWidth / 2;

        container.scrollTo({
          behavior: 'instant',
          left: scrollLeft,
        });
      }
    }
  };

  /*
  const handleScroll = () => {
    if (isScrollingToIndex) {
      setIsScrollingToIndex(false);
      return;
    }

    const container = containerRef.current;
    if (container) {
      const containerWidth = container.offsetWidth;
      const scrollLeft = container.scrollLeft;

      const middle = scrollLeft + containerWidth / 2;
      const items = container.getElementsByClassName('item') as HTMLCollectionOf<HTMLElement>;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemWidth = item.offsetWidth;
        const itemLeft = item.offsetLeft;

        if (itemLeft <= middle && itemLeft + itemWidth >= middle) {
          setSelectedItem(i);
          break;
        }
      }



      // Check if the scroll has stopped for a brief moment
      clearTimeout(scrollStopTimeout!);

      scrollStopTimeout = setTimeout(() => {
        if (selectedItem !== null) {
          // Scroll has stopped; you can react here
          console.log('Scroll has stopped');
          scrollToIndex(selectedItem);
        }
      }, 1000); // Adjust the timeout duration as needed

    }
  };
*/
  const handleMouseDown = (e: MouseEvent) => {
    if (containerRef.current) {
      isDragging.current = true;
      dragStartX.current = e.clientX;

      const currentScrollLeft = containerRef.current.scrollLeft;
      leftScrollStart.current = currentScrollLeft;
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;

    const container = containerRef.current;
    if (container && leftScrollStart.current) {
      const deltaX = e.clientX - dragStartX.current;

      container.scrollTo({
        behavior: 'instant',
        left: leftScrollStart.current - deltaX,
      });
    }
  };

  const handleItemClick = (index: number) => {
    if (containerRef.current) {
      const initialScrollLeft = leftScrollStart.current;

      // Wait for a short delay to ensure the scroll position doesn't change due to the click
      setTimeout(() => {
        const currentScrollLeft = containerRef.current?.scrollLeft;

        if (initialScrollLeft === currentScrollLeft) {
          // Scroll position hasn't changed, it's a click
          console.log('Item clicked');
          scrollToIndex(index);
        }
      }, 100); // You can adjust the delay as needed
    }
  };

  const handleMouseWheel = (e: WheelEvent) => {
    if (!containerRef.current) return;

    e.preventDefault();
    containerRef.current.scrollLeft += e.deltaY;
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
      dragStartX.current = null;

      if (selectedItem) {
        scrollToIndex(selectedItem);
      }
    };

    const container = containerRef.current;
    //container?.addEventListener('scroll', handleScroll);
    container?.addEventListener('mousedown', handleMouseDown);
    container?.addEventListener('wheel', handleMouseWheel);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      //container?.removeEventListener('scroll', handleScroll);
      container?.removeEventListener('mousedown', handleMouseDown);
      container?.removeEventListener('wheel', handleMouseWheel);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [selectedItem]);

  return (
    <div className="relative w-full overflow-hidden">
      <style>
        {`
          .horizontal-scroll-container::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
          }
          .horizontal-scroll-container {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .item {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .bars {
            display: flex;
            justify-content: center;
            width: 100%;
            height: 20px; /* Adjust the height of the bars */
          }

          .bar-wrapper{
            display: flex;
            align-items: end;
          }

          .bar {
            opacity: 0.4;
            width: 7px; /* Adjust the width of the bars */
          }
          .number {
            z-index: 1; /* Overlay the number on top of bars */
          }
        `}
      </style>
      <div
        ref={containerRef}
        className="horizontal-scroll-container mx-auto flex space-x-4 rounded-b-full rounded-t-full border border-gray-300"
        style={{ scrollSnapType: 'x mandatory', overflowX: 'auto', cursor: 'grab' }}
      >
        {props.items.map((item, index) => {
          // Generate random heights for the green and red bars (grow from bottom to top)
          const greenBarHeight = Math.random() * 20; // Adjust the range as needed
          const redBarHeight = Math.random() * 20; // Adjust the range as needed

          return (
            <div
              key={index}
              className={`min-w-1/5 relative w-10 px-4 py-2 ${
                selectedItem === index ? 'bg-gray-200 font-bold' : ''
              } item`}
              onClick={() => handleItemClick(index)}
            >
              <div className="bars">
                <div className="bar-wrapper">
                  <div
                    style={{ backgroundColor: 'green', height: greenBarHeight + 'px' }}
                    className="bar"
                  ></div>
                </div>
                <div className="bar-wrapper">
                  <div
                    style={{ backgroundColor: 'red', height: redBarHeight + 'px' }}
                    className="bar"
                  ></div>
                </div>
              </div>
              <span className="number">{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalScrollingPicker;
