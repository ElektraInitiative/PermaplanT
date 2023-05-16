import {
  calculateGridStep,
  yardStickLabel,
} from '@/features/map_planning/layers/_frontend_only/grid/util/Calculations';

describe('grid calculations', () => {
  it('calculates the correct grid step given the screen size', () => {
    expect(calculateGridStep(24)).toEqual(10);
    expect(calculateGridStep(3546)).toEqual(100);
    expect(calculateGridStep(14000)).toEqual(1000);
  });

  it('finds the correct yard stick label given the screen size', () => {
    expect(yardStickLabel(136, 'm', 'cm')).toBe('10cm');
    expect(yardStickLabel(4362, 'm', 'cm')).toBe('1m');
    expect(yardStickLabel(199462, 'm', 'cm')).toBe('10m');
  });
});
