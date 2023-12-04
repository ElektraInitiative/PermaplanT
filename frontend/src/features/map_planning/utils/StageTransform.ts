import { Stage } from 'konva/lib/Stage';
import { Vector2d } from 'konva/lib/types';

export const handleZoom = (
  pointer: Vector2d,
  deltaY: number,
  stage: Stage,
  setStage: React.Dispatch<
    React.SetStateAction<{
      scale: number;
      x: number;
      y: number;
    }>
  >,
) => {
  const pointerX = pointer.x;
  const pointerY = pointer.y;

  const scaleBy = 1.4;

  const oldScale = stage.scaleX();
  const mousePointTo = {
    x: pointerX / oldScale - stage.x() / oldScale,
    y: pointerY / oldScale - stage.y() / oldScale,
  };

  const newScale = deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

  if (newScale < 0.05) return;

  setStage({
    scale: newScale,
    x: (pointerX / newScale - mousePointTo.x) * newScale,
    y: (pointerY / newScale - mousePointTo.y) * newScale,
  });
};

export const handleScroll = (dx: number, dy: number, stage: Stage) => {
  const x = stage.position().x;
  const y = stage.position().y;
  const scrollingScalePx = 15;

  // Diagonal scaling factor is used to enable diagonal scrolling.
  // Formula used is the pythagoras theorem.
  const diagonalScalingFactor = Math.sqrt(dx * dx + dy * dy) / scrollingScalePx;

  // Decay factor is used to give the scrolling a more natural feel that decays/slows over time.
  const decayFactor = 1;
  // todo: decayFactor = 1 / (1 + (0.1 * scrollCount) / 2);
  // difficult part is figuring out how to reset the scroll count.
  // how do we determine a scroll has finished? ideas: debounce or timeout.

  if (dx !== 0 && dy !== 0) {
    stage.setPosition({
      x: x - (dx / diagonalScalingFactor) * decayFactor,
      y: y - (dy / diagonalScalingFactor) * decayFactor,
    });
  } else if (dx !== 0) {
    stage.setPosition({ x: x - (dx / scrollingScalePx) * decayFactor, y });
  } else if (dy !== 0) {
    stage.setPosition({ x, y: y - (dy / scrollingScalePx) * decayFactor });
  }
};
