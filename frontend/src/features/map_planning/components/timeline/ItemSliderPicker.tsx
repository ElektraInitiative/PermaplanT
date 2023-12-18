import React, { useRef, useState, useEffect, ReactNode, useCallback } from 'react';
import './styles/timeline.css';

export type ItemSliderItem = {
  key: number;
  content: ReactNode;
};

interface ItemSliderPickerProps {
  /** List of items to display */
  items: ItemSliderItem[];
  /** Callback when an item is selected */
  onChange: (selectedItemKey: number) => void;
  /** Callback when new item is marked as selected during dragging */
  onDragSelectionChanged: (selectedItemKey: number) => void;
  /** Callback that fires when the left end of the slider is reached */
  leftEndReached?: () => void;
  /** Callback that fires when the right end of the slider is reached */
  rightEndReached?: () => void;
  /** the initial selected item key*/
  value?: number;
  /** id for testing */
  dataTestId?: string;
  /** If set to true, the slider will automatically gain focus when rendered or displayed. */
  autoFocus: boolean;
  /** Callback that fires when slider is focused*/
  onFocus: () => void;
}

const ItemSliderPicker = ({
  items,
  onChange,
  onDragSelectionChanged,
  value,
  leftEndReached,
  rightEndReached,
  dataTestId,
  autoFocus,
  onFocus,
}: ItemSliderPickerProps) => {
  const [selectedItemKey, setSelectedItemKey] = useState(0);

  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef<number | null>(null);

  const scrollPositionOnMouseDown = useRef<number | null>(null);
  const isScrollingToIndex = useRef(false);

  const detectAndNotifyIfBordersIsReached = () => {
    const container = sliderContainerRef.current;

    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;
    const scrollWidth = container.scrollWidth;

    const threshold = 500;
    if (scrollLeft < threshold) {
      leftEndReached?.();
    } else if (scrollWidth - scrollLeft - containerWidth < threshold) {
      rightEndReached?.();
    }
  };

  const setSelectedItemAndDetectIfBordersAreReached = (itemKey: number) => {
    if (itemKey == selectedItemKey) return;

    setSelectedItemKey(itemKey);
    detectAndNotifyIfBordersIsReached();
  };

  const getSelectedItemIndex = useCallback(() => {
    return items.findIndex((item) => item.key === selectedItemKey);
  }, [items, selectedItemKey]);

  const setSelectedItemAndNotifyParent = (selectedItemKey: number) => {
    setSelectedItemAndDetectIfBordersAreReached(selectedItemKey);
    onChange(selectedItemKey);
  };

  const scrollToIndex = (idx: number) => {
    const container = sliderContainerRef.current;

    if (!container) return;

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
  };

  const selectNextItem = () => {
    const container = sliderContainerRef.current;

    if (!container) return;

    const selectedIndex = getSelectedItemIndex();

    const newSelectedIndex = Math.min(selectedIndex + 1, items.length - 1);
    if (newSelectedIndex !== selectedIndex) {
      setSelectedItemAndNotifyParent(items[newSelectedIndex].key);
      scrollToIndex(newSelectedIndex);
    }
  };

  const selectPreviousItem = () => {
    const selectedIndex = getSelectedItemIndex();

    const newSelectedIndex = Math.max(selectedIndex - 1, 0);
    if (newSelectedIndex !== selectedIndex) {
      scrollToIndex(newSelectedIndex);
      setSelectedItemAndNotifyParent(items[newSelectedIndex].key);
    }
  };

  const identifySelectedIndexBasedOnScrollPosition: () => number = () => {
    const container = sliderContainerRef.current;

    if (!container) return 0;

    const containerWidth = container.offsetWidth;
    const scrollLeft = container.scrollLeft;
    const middle = scrollLeft + containerWidth / 2;
    const itemElements = container.getElementsByClassName('item') as HTMLCollectionOf<HTMLElement>;

    for (let i = 0; i < itemElements.length; i++) {
      const item = itemElements[i];
      const itemWidth = item.offsetWidth;
      const itemLeft = item.offsetLeft;

      if (itemLeft <= middle && itemLeft + itemWidth >= middle) {
        return i;
      }
    }

    return 0;
  };

  const handleScroll = () => {
    // If we automatically scroll to an index, we don't want to handle the scroll event.
    if (isScrollingToIndex.current) {
      isScrollingToIndex.current = false;
      return;
    }

    const selectedItemIndex: number = identifySelectedIndexBasedOnScrollPosition();
    onDragSelectionChanged(selectedItemIndex);
    setSelectedItemAndDetectIfBordersAreReached(items[selectedItemIndex].key);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = sliderContainerRef.current;

    if (!container) return;

    isDragging.current = true;
    dragStartX.current = e.clientX;

    scrollPositionOnMouseDown.current = container.scrollLeft;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;

    const container = sliderContainerRef.current;
    if (!container || !scrollPositionOnMouseDown.current) return;

    const deltaX = e.clientX - dragStartX.current;

    container.scrollTo({
      behavior: 'auto',
      left: scrollPositionOnMouseDown.current - deltaX,
    });
  };

  const handleItemClick = (e: React.MouseEvent, index: number) => {
    const container = sliderContainerRef.current;
    if (container && scrollPositionOnMouseDown.current === container.scrollLeft) {
      setSelectedItemAndNotifyParent(items[index].key);
      scrollToIndex(index);
    }
  };

  const handleMouseUp = () => {
    if (
      isDragging.current &&
      scrollPositionOnMouseDown.current !== sliderContainerRef.current?.scrollLeft
    ) {
      scrollToIndex(getSelectedItemIndex());
      onChange(selectedItemKey);
    }

    isDragging.current = false;
    dragStartX.current = null;
  };

  const handleMouseWheel = (e: WheelEvent) => {
    const container = sliderContainerRef.current;
    if (!container) return;

    e.preventDefault();
    if (e.deltaY > 0) {
      selectPreviousItem();
    } else {
      selectNextItem();
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
    const container = sliderContainerRef.current;
    container?.addEventListener('wheel', handleMouseWheel);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
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

  useEffect(() => {
    if (sliderContainerRef.current && autoFocus) {
      sliderContainerRef.current.focus();
    }
  }, [autoFocus]);

  const SliderPadding = () => {
    return (
      <div
        style={{
          minWidth: sliderContainerRef.current ? sliderContainerRef.current.offsetWidth / 2 : 0,
        }}
      ></div>
    );
  };

  return (
    <div className="relative w-full select-none">
      <div
        tabIndex={0}
        data-testid={dataTestId}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        ref={sliderContainerRef}
        onFocus={onFocus}
        className="horizontal-scroll-container group mx-auto flex border border-gray-300 bg-white text-black outline-none dark:border-gray-600 dark:bg-neutral-200-dark dark:text-white"
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
              className={`item dark border-4 border-white px-2 pt-1 dark:border-neutral-200-dark
              ${
                getSelectedItemIndex() === index
                  ? 'selected-item bg-gray-300 font-bold text-secondary-300 group-focus:border-blue-300 dark:bg-black '
                  : ''
              }
              `}
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
