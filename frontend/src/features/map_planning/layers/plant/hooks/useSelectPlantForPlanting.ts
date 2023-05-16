import useMapStore from '@/features/map_planning/store/MapStore';

export function useSelectPlantForPlanting() {
  const selectPlantForPlanting = useMapStore((state) => state.selectPlantForPlanting);

  return {
    actions: {
      selectPlantForPlanting,
    },
  };
}
