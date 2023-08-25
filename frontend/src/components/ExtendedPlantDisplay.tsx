import { PlantsSummaryDto, SeedDto } from '@/bindings/definitions';
import { ExtendedPlantsSummary } from '@/utils/ExtendedPlantsSummary';

const ExtendedPlantsSummaryDisplayName = ({
  plant,
  seed,
}: {
  plant: PlantsSummaryDto;
  seed?: SeedDto;
}) => {
  const transformedPlant = new ExtendedPlantsSummary(plant);

  // The additional name is the seeds name.
  // It should be displayed every time a seed exists for a plant.
  const additionalName = seed ? `- ${seed.name}` : '';

  return (
    <span>
      {transformedPlant.displayName.common_name ? (
        <>
          {transformedPlant.displayName.common_name} {additionalName} (
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
