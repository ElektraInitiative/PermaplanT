import { FillPatternType } from '@/features/map_planning/layers/drawing/types';

export function getFillPattern(fillPatternType: FillPatternType, color: string) {
  switch (fillPatternType) {
    case 'hatch':
      return getHatchFillPattern(color);
    case 'crosshatch':
      return getCrosshatchFillPattern(color);
    default:
      return undefined;
  }
}

export function getHatchFillPattern(color: string) {
  const svgPattern = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgPattern.setAttribute('width', '20');
  svgPattern.setAttribute('height', '20');

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', '0');
  line.setAttribute('y1', '0');
  line.setAttribute('x2', '20');
  line.setAttribute('y2', '20');
  line.setAttribute('stroke', color);
  line.setAttribute('stroke-width', '1');
  svgPattern.appendChild(line);

  const patternImage = new Image();
  patternImage.src =
    'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svgPattern));

  return patternImage;
}

export function getCrosshatchFillPattern(color: string) {
  const svgPattern = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgPattern.setAttribute('width', '20');
  svgPattern.setAttribute('height', '20');

  const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line1.setAttribute('x1', '0');
  line1.setAttribute('y1', '0');
  line1.setAttribute('x2', '20');
  line1.setAttribute('y2', '20');
  line1.setAttribute('stroke', color);
  line1.setAttribute('stroke-width', '1');
  svgPattern.appendChild(line1);

  const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line2.setAttribute('x1', '0');
  line2.setAttribute('y1', '20');
  line2.setAttribute('x2', '20');
  line2.setAttribute('y2', '0');
  line2.setAttribute('stroke', color);
  line2.setAttribute('stroke-width', '1');
  svgPattern.appendChild(line2);

  const patternImage = new Image();
  patternImage.src =
    'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svgPattern));

  return patternImage;
}
