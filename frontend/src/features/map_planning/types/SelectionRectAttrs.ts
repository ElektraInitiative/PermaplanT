export interface SelectionRectAttrs {
  x: number;
  y: number;
  width: number;
  height: number;
  isVisible: boolean;
  boundingBox: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}
