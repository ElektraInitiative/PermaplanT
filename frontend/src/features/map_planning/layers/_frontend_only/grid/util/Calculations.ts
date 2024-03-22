import { ONE_METER, TEN_CENTIMETERS } from '@/features/map_planning/utils/Constants';

/**
 * Calculates how far individual grid dots should be seperated.
 * @param screenWidth current screen width
 */
export function calculateGridStep(screenWidth: number): number {
  if (screenWidth > 70 * ONE_METER) {
    return 10 * ONE_METER;
  }

  if (screenWidth > 5 * ONE_METER) {
    return ONE_METER;
  }

  return TEN_CENTIMETERS;
}

/**
 * Get the correct distance label for the yard stick given the current screen width.
 *
 * @param screenWidth current screen width
 * @param meterLabel translation for the meter unit shorthand (e.g. 'm' in english)
 * @param centimeterLabel translation for the centimeter unit shorthand (e.g. 'cm' in english)
 */
export function yardStickLabel(
  screenWidth: number,
  meterLabel: string,
  centimeterLabel: string,
): string {
  const gridStep = calculateGridStep(screenWidth);

  if (gridStep === 10 * ONE_METER) {
    return '10' + meterLabel;
  }

  if (gridStep === ONE_METER) {
    return '1' + meterLabel;
  }

  if (gridStep === TEN_CENTIMETERS) {
    return '10' + centimeterLabel;
  }

  // Note: this should never be reached
  return 'Error';
}
