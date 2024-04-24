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
    case FillPatternType.Wave:
      return generateWavePatternImage(color);

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

export function generateWavePatternImage(color: string) {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="30.88pt" height="24.88pt" viewBox="0 0 50.88 40.88">
    <g fill="none">
      <path fill="none" stroke="${color}" stroke-width="0.72" stroke-linecap="round" stroke-linejoin="bevel" d="M0 4.69282C0.985137 2.01278 2.25742 -0.0865862 6.4321 0.00274856C10.6068 0.0920833 10.0866 4.90362 15.1422 4.96083C19.8024 5.01356 20.9323 3.05163 21.7084 0.00274856" />
      <path fill="none" stroke="${color}" stroke-width="0.72" stroke-linecap="round" stroke-linejoin="bevel" d="M0 6.11078C0.559054 4.03921 2.32533 -0.0924735 6.47423 0.00157876C10.6232 0.095631 10.3594 6.00832 15.3838 6.06855C20.0152 6.12407 19.749 5.10587 21.2043 2.55455" />
      <path fill="none" stroke="${color}" stroke-width="0.72" stroke-linecap="round" stroke-linejoin="bevel" d="M0 4.66884C0.852201 2.59727 1.71405 -0.0916517 5.86295 0.00240058C10.0119 0.0964528 9.82841 6.84595 14.8528 6.90618C19.4842 6.9617 20.3124 5.01793 21.0837 1.80804" />
      <path fill="none" stroke="${color}" stroke-width="0.2351996928" stroke-linecap="square" stroke-linejoin="bevel" d="M0 0.45L0.03 0" />
      <path fill="none" stroke="${color}" stroke-width="0.2351996928" stroke-linecap="square" stroke-linejoin="bevel" d="M0.27 0L0 0.78" />
      <path fill="none" stroke="${color}" stroke-width="0.72" stroke-linecap="round" stroke-linejoin="bevel" d="M0 4.69282C0.985137 2.01278 2.25742 -0.0865862 6.4321 0.00274856C10.6068 0.0920833 10.0866 4.90362 15.1422 4.96083C19.8024 5.01356 20.9323 3.05163 21.7084 0.00274856" transform="translate(31.6437293252044, 13.0882191507231)" />
      <path fill="none" stroke="${color}" stroke-width="0.72" stroke-linecap="round" stroke-linejoin="bevel" d="M0 6.11078C0.559054 4.03921 2.32533 -0.0924735 6.47423 0.00157876C10.6232 0.095631 10.3594 6.00832 15.3838 6.06855C20.0152 6.12407 19.749 5.10587 21.2043 2.55455" transform="translate(31.6437293252044, 13.0882191507231)" />
      <path fill="none" stroke="${color}" stroke-width="0.72" stroke-linecap="round" stroke-linejoin="bevel" d="M0 4.66884C0.852201 2.59727 1.71405 -0.0916517 5.86295 0.00240058C10.0119 0.0964528 9.82841 6.84595 14.8528 6.90618C19.4842 6.9617 20.3124 5.01793 21.0837 1.80804" transform="translate(31.6437293252044, 13.0882191507231)" />
      <path fill="none" stroke="${color}" stroke-width="0.2351996928" stroke-linecap="square" stroke-linejoin="bevel" d="M0 0.45L0.03 0" transform="translate(21.2822425474783, 0.122301982796442)" />
      <path fill="none" stroke="${color}" stroke-width="0.2351996928" stroke-linecap="square" stroke-linejoin="bevel" d="M0 0.1548C0.84 1.0248 2.08873 1.158 4.51873 1.548C6.99873 1.378 8.70394 1.37 9.89394 0" transform="translate(9.58626474441702, 1.62843927570297)" />
    </g>
  </svg>`;

  const imageUrl = 'data:image/svg+xml;base64,' + btoa(svgString);
  const image = new Image();
  image.src = imageUrl;

  return image;
}
