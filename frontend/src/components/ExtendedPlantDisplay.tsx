import { PlantsSummaryDto } from '@/bindings/definitions';
import { ExtendedPlantsSummary } from '@/utils/ExtendedPlantsSummary';

const ExtendedPlantsSummaryDisplayName = ({ plant }: { plant: PlantsSummaryDto }) => {
  const transformedPlant = new ExtendedPlantsSummary(plant);

  return (
    <span>
      {transformedPlant.displayName.common_name ? (
        <>
          {transformedPlant.displayName.common_name} (
          <i>{transformedPlant.displayName.unique_name}</i>
          {transformedPlant.displayName.cultivar
            ? ` '${transformedPlant.displayName.cultivar}'`
            : ''}
          )
        </>
      ) : (
        <>
          <i>{transformedPlant.displayName.unique_name}</i>
          {transformedPlant.displayName.cultivar
            ? ` '${transformedPlant.displayName.cultivar}'`
            : ''}
        </>
      )}
    </span>
  );
};
export { ExtendedPlantsSummaryDisplayName };
