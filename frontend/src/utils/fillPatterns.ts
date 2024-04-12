import { FillPatternType } from '@/api_types/definitions';

export function getFillPattern(fillPatternType: FillPatternType | undefined, color: string) {
  switch (fillPatternType) {
    case FillPatternType.HatchUp:
      return getHatchUpFillPattern(color);
    case FillPatternType.HatchDown:
      return getHatchDownFillPattern(color);
    case FillPatternType.CrossHatch:
      return getCrosshatchFillPattern(color);
    case FillPatternType.Points:
      return generatePointsPatternAsImage(color);

    default:
      return undefined;
  }
}

export function getHatchDownFillPattern(color: string) {
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

export function getHatchUpFillPattern(color: string) {
  const svgPattern = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgPattern.setAttribute('width', '20');
  svgPattern.setAttribute('height', '20');

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', '0');
  line.setAttribute('y1', '20');
  line.setAttribute('x2', '20');
  line.setAttribute('y2', '0');
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

export function generatePointsPatternAsImage(color: string) {
  const svgString = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="54.53715215044638" cy="81.42323967335288" r="2" fill="${color}"/>
      <circle cx="13.189116525287193" cy="4.935229135267377" r="3" fill="${color}"/>
      <circle cx="78.46823927737354" cy="45.89420877442292" r="1" fill="${color}"/>
      <circle cx="36.086470931228785" cy="68.11523379910046" r="2.5" fill="${color}"/>
      <circle cx="80.66161147680043" cy="19.9312266949384" r="1.5" fill="${color}"/>
      <circle cx="65.12397743605684" cy="82.34531852930537" r="1" fill="${color}"/>
      <circle cx="19.07989251213112" cy="79.6915538951041" r="2" fill="${color}"/>
      <circle cx="85.11372096049774" cy="45.924120674059735" r="2.5" fill="${color}"/>
      <circle cx="70.9198898448658" cy="69.06750627339662" r="3" fill="${color}"/>
      <circle cx="62.633589456291114" cy="32.57946503528527" r="1.5" fill="${color}"/>

      <circle cx="29.07989251213112" cy="49.6915538951041" r="4" fill="${color}"/>
      <circle cx="55.11372096049774" cy="20.924120674059735" r="3.5" fill="${color}"/>
      <circle cx="80.9198898448658" cy="9.06750627339662" r="3" fill="${color}"/>
      <circle cx="12.633589456291114" cy="32.57946503528527" r="4.5" fill="${color}"/>
    </svg>`;

  const imageUrl = 'data:image/svg+xml;base64,' + btoa(svgString);

  const image = new Image();
  image.src = imageUrl;

  return image;
}
