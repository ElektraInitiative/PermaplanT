import './styles/timeline.css';
import React, { useRef, useState, useEffect, ReactNode } from 'react';

interface HorizontalScrollingPickerProps {
  /** List of items to display */
  items: ReactNode[];

  /** Callback when an item is selected */
  onChange: (selectedIndex: number) => void;
  /** optinal initial value */
  value?: string;
}

const HorizontalScrollingPicker: React.FC<HorizontalScrollingPickerProps> = (props) => {
  // State to keep track of the selected item index.
  const [selectedItem, setSelectedItem] = useState<number>(1);

  // Refs to interact with the scrolling container and handle dragging.
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number | null>(null);

  // Refs to keep track of scrolling and item selection changes.
  const scrollPositionOnMouseDown = useRef<number | null>(null);
  const isScrollingToIndex = useRef<boolean>(false);

  const updateSelectedItem = (index: number) => {
    setSelectedItem(index);
    props.onChange(index);
  };

  const scrollToItem = (idx: number) => {
    const container = containerRef.current;
    if (container) {
      const items = container.getElementsByClassName('item') as HTMLCollectionOf<HTMLElement>;
      const selectedElement = items[idx];
      const containerWidth = container.offsetWidth;
      const itemWidth = selectedElement.offsetWidth;
      const scrollLeft = selectedElement.offsetLeft + itemWidth / 2 - containerWidth / 2;

      isScrollingToIndex.current = true;
      container.scrollTo({
        behavior: 'auto',
        left: scrollLeft,
      });
    }
  };

  const selectNextItem = () => {
    const container = containerRef.current;
    if (container) {
      const items = container.getElementsByClassName('item') as HTMLCollectionOf<HTMLElement>;
      const newSelected = Math.min(selectedItem + 1, items.length - 1);
      if (newSelected !== selectedItem) {
        updateSelectedItem(newSelected);
        scrollToItem(newSelected);
      }
    }
  };

  const selectPreviousItem = () => {
    const newSelected = Math.max(selectedItem - 1, 0);
    if (newSelected !== selectedItem) {
      updateSelectedItem(newSelected);
      scrollToItem(newSelected);
    }
  };

  // Identify the selected item (item that is placed in the middle) based on the scroll position.
  const identifySelectedElement = () => {
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
    }
  };

  const handleScroll = () => {
    // If we are autiomatically scroll to an item we dont't want to handle the scroll event.
    if (isScrollingToIndex.current) {
      isScrollingToIndex.current = false;
      return;
    }

    identifySelectedElement();
  };

  const handleMouseDown = (e: MouseEvent) => {
    const container = containerRef.current;

    if (container) {
      isDragging.current = true;
      dragStartX.current = e.clientX;

      scrollPositionOnMouseDown.current = container.scrollLeft;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;

    const container = containerRef.current;
    if (container && scrollPositionOnMouseDown.current) {
      const deltaX = e.clientX - dragStartX.current;

      container.scrollTo({
        behavior: 'auto',
        left: scrollPositionOnMouseDown.current - deltaX,
      });
    }
  };

  const handleItemClick = (e: React.MouseEvent, index: number) => {
    const container = containerRef.current;
    if (container && scrollPositionOnMouseDown.current === container.scrollLeft) {
      updateSelectedItem(index);
      scrollToItem(index);
    }
  };

  const handleMouseUp = () => {
    //when stop dragging we want to scroll to the selected item and update the selected item
    if (
      isDragging.current &&
      scrollPositionOnMouseDown.current !== containerRef.current?.scrollLeft
    ) {
      scrollToItem(selectedItem);
      props.onChange(selectedItem);
    }

    isDragging.current = false;
    dragStartX.current = null;
  };

  const handleMouseWheel = (e: WheelEvent) => {
    const container = containerRef.current;
    if (container) {
      e.preventDefault(); // Prevent the page from scrolling

      if (e.deltaY > 0) {
        selectPreviousItem();
      } else {
        selectNextItem();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      selectPreviousItem();
      e.stopPropagation();
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      selectNextItem();
      e.stopPropagation();
      e.preventDefault();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    container?.addEventListener('mousedown', handleMouseDown);
    container?.addEventListener('wheel', handleMouseWheel);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      container?.removeEventListener('scroll', handleScroll);
      container?.removeEventListener('mousedown', handleMouseDown);
      container?.removeEventListener('wheel', handleMouseWheel);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });

  // Component to add padding to the beginning and end of the scroll container.
  const SliderPadding = () => {
    return (
      <div
        style={{ minWidth: containerRef.current ? containerRef.current.offsetWidth / 2 : 0 }}
      ></div>
    );
  };

  return (
    <div className="relative w-full">
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        ref={containerRef}
        className="horizontal-scroll-container  mx-auto flex border border-gray-300 bg-white outline-none"
        style={{
          scrollSnapType: 'x mandatory',
          overflowX: 'auto',
          cursor: 'grab',
          clipPath:
            'polygon(30px 0,calc(100% - 30px) 0,100% 50%,calc(100% - 30px) 100%,30px 100%,0% 50%)',
        }}
      >
        <SliderPadding />

        {props.items.map((item, index) => {
          return (
            <div
              key={index}
              className={`min-w-1/5 relative w-10 px-7 pt-1 ${
                selectedItem === index ? 'bg-gray-200 font-bold' : ''
              } item flex flex-col items-center justify-end`}
              onClick={(e) => handleItemClick(e, index)}
            >
              {item}
            </div>
          );
        })}

        <SliderPadding />
      </div>
    </div>
  );
};

export default HorizontalScrollingPicker;
