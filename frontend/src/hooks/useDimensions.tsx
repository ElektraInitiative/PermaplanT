import { RefObject, useLayoutEffect, useState } from 'react';

export function useDimensions(ref: RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [ref]);

  return dimensions;
}
