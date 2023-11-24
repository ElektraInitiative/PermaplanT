import './styles/timeline.css';
import React, { useRef, useState, useEffect, ReactNode, useCallback } from 'react';

export type ItemSliderItem = {
  key: number;
  content: ReactNode;
};

interface ItemSliderPickerProps {
  /** List of items to display */
  items: ItemSliderItem[];
  /** Callback when an item is selected */
  onChange: (selectedItemKey: number) => void;
  /** Callback that fires when the left end of the slider is reached */
  leftEndReached?: () => void;
  /** Callback that fires when the right end of the slider is reached */
  rightEndReached?: () => void;
  /** initial value */
  value?: number;
  /** id for testing */
  testDataId?: string;
}

const ItemSliderPicker: React.FC<ItemSliderPickerProps> = ({
  items,
  onChange,
  value,
  leftEndReached,
  rightEndReached,
  testDataId,
}: ItemSliderPickerProps) => {
  // State to keep track of the selected item key.
  const [selectedItemKey, setSelectedItemKey] = useState<number>(0);

  // Refs to interact with the scrolling container and handle dragging.
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number | null>(null);

  // Refs to keep track of scrolling and item selection changes.
  const scrollPositionOnMouseDown = useRef<number | null>(null);
  const isScrollingToIndex = useRef<boolean>(false);

  const checkIfBordersAreReached = () => {
    const container = containerRef.current;
    if (container) {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.offsetWidth;
      const scrollWidth = container.scrollWidth;

      // Define a threshold for how close to the ends you want to trigger the callback.
      const threshold = 500;

      // Check if you are near the left end.
      if (scrollLeft < threshold) {
        leftEndReached && leftEndReached();
      } else if (scrollWidth - scrollLeft - containerWidth < threshold) {
        rightEndReached && rightEndReached();
      }
    }
  };

  const setSelectedItemAndCheckIfBordersAreReached = (itemKey: number) => {
    setSelectedItemKey(itemKey);
    checkIfBordersAreReached();
  };

  const getSelectedItemIndex = useCallback(() => {
    return items.findIndex((item) => item.key === selectedItemKey);
  }, [items, selectedItemKey]);

  const setSelectedItemAndNotifyChanged = (selectedItemKey: number) => {
    setSelectedItemAndCheckIfBordersAreReached(selectedItemKey);
    onChange(selectedItemKey);
  };

  const scrollToIndex = (idx: number) => {
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
      const selectedIndex = getSelectedItemIndex();

      const newSelectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      if (newSelectedIndex !== selectedIndex) {
        setSelectedItemAndNotifyChanged(items[newSelectedIndex].key);
        scrollToIndex(newSelectedIndex);
      }
    }
  };

  const selectPreviousItem = () => {
    const selectedIndex = getSelectedItemIndex();

    const newSelectedIndex = Math.max(selectedIndex - 1, 0);
    if (newSelectedIndex !== selectedIndex) {
      setSelectedItemAndNotifyChanged(items[newSelectedIndex].key);
      scrollToIndex(newSelectedIndex);
    }
  };

  // Identify the selected item (item that is placed in the middle) based on the scroll position.
  const identifySelectedElementBasedOnScrollPosition = () => {
    const container = containerRef.current;
    if (container) {
      const containerWidth = container.offsetWidth;
      const scrollLeft = container.scrollLeft;
      const middle = scrollLeft + containerWidth / 2;
      const itemElements = container.getElementsByClassName(
        'item',
      ) as HTMLCollectionOf<HTMLElement>;

      for (let i = 0; i < itemElements.length; i++) {
        const item = itemElements[i];
        const itemWidth = item.offsetWidth;
        const itemLeft = item.offsetLeft;

        if (itemLeft <= middle && itemLeft + itemWidth >= middle) {
          setSelectedItemAndCheckIfBordersAreReached(items[i].key);
          break;
        }
      }
    }
  };

  const handleScroll = () => {
    // If we are autiomatically scroll to an index we dont't want to handle the scroll event.
    if (isScrollingToIndex.current) {
      isScrollingToIndex.current = false;
      return;
    }

    identifySelectedElementBasedOnScrollPosition();
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
      setSelectedItemAndNotifyChanged(items[index].key);
      scrollToIndex(index);
    }
  };

  const handleMouseUp = () => {
    //when stop dragging we want to scroll to the selected item and update the selected item
    if (
      isDragging.current &&
      scrollPositionOnMouseDown.current !== containerRef.current?.scrollLeft
    ) {
      scrollToIndex(getSelectedItemIndex());
      onChange(selectedItemKey);
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

  // Add a useEffect hook to scroll to the selected item when items change from the outside.
  useEffect(() => {
    const selectedIndex = getSelectedItemIndex();
    const selectedItemIndex = Math.min(Math.max(selectedIndex, 0), items.length - 1);
    scrollToIndex(selectedItemIndex);
  }, [items, getSelectedItemIndex]);

  // Add a useEffect hook to update the selected item when the selected value changes from the outside.
  useEffect(() => {
    if (value === undefined) return;

    setSelectedItemKey(value);
    scrollToIndex(items.findIndex((item) => item.key === value));
  }, [value, items]);

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
        data-testid={testDataId}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        ref={containerRef}
        className="horizontal-scroll-container mx-auto flex border border-gray-300 bg-white outline-none dark:border-gray-600 dark:bg-neutral-200-dark"
        style={{
          scrollSnapType: 'x mandatory',
          overflowX: 'auto',
          cursor: 'grab',
          clipPath:
            'polygon(30px 0,calc(100% - 30px) 0,100% 50%,calc(100% - 30px) 100%,30px 100%,0% 50%)',
        }}
      >
        <SliderPadding />

        {items.map((item, index) => {
          return (
            <div
              key={index}
              className={`min-w-1/5 relative w-10 border-4 px-7 pb-1 pt-1  ${
                getSelectedItemIndex() === index
                  ? 'bg-gray-300 font-bold text-black dark:bg-black'
                  : ''
              }
              ${
                getSelectedItemIndex() === index && document.activeElement === containerRef.current
                  ? 'border-blue-300'
                  : 'border-white'
              }
              item flex flex-col items-center justify-end`}
              onClick={(e) => handleItemClick(e, index)}
            >
              {item.content}
            </div>
          );
        })}

        <SliderPadding />
      </div>
    </div>
  );
};

export default ItemSliderPicker;
