import { PlantsSummaryDto, SeedDto } from '@/bindings/definitions';
import { ReactElement } from 'react';

/**
 * Gets the common name from a PlantsSummaryDto.
 *
 * German common names are currently not supported.
 * @param plant DTO containing the most essential information of a plant.
 */
export function commonName(plant: PlantsSummaryDto): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const common_name = plant.common_name_en[0];

  return hasCommonName(plant) ? common_name : '';
}

/**
 * Generate a partial plant name from a PlantsSummaryDto.
 * Format:
 * - "common name (unique name)"
 * - "unique name" if no common name is specified.
 *
 * German common names are currently not supported.
 * @param plant DTO containing the most essential information of a plant.
 */
export function partialPlantName(plant: PlantsSummaryDto): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const common_name = plant.common_name_en[0];

  return hasCommonName(plant) ? `${common_name} (${plant.unique_name})` : plant.unique_name;
}

/**
 * Component representing an HTML formatted partial plant name.
 * Format:
 * - "common name (<i>unique name</i>)"
 * - "unique name" if no common name is specified.
 *
 * German common names are currently not supported.
 * @param props component properties
 */
export function PartialPlantNameFormatted(props: { plant: PlantsSummaryDto }): ReactElement {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const common_name = props.plant.common_name_en[0];

  return hasCommonName(props.plant) ? (
    <>
      {common_name} ({formatUniqueName(props.plant.unique_name)})
    </>
  ) : (
    formatUniqueName(props.plant.unique_name)
  );
}

/**
 * Generate a complete plant name from a PlantsSummaryDto and SeedDto.
 * Format:
 * - "common name - additional name (unique name)"
 * - "unique name - additional" if no common name is specified.
 *
 * German common names are currently not supported.
 * @param plant DTO containing the most essential information of a plant.
 * @param seed DTO containing seed information.
 */
export function completePlantName(seed: SeedDto, plant: PlantsSummaryDto): string {
  console.assert(seed.plant_id === plant.id);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const common_name = plant.common_name_en[0];

  return hasCommonName(plant)
    ? `${common_name} - ${seed.name} (${plant.unique_name})`
    : `${plant.unique_name} - ${seed.name}`;
}

/**
 * Component representing an HTML formatted complete plant name given a PlantsSummaryDto.
 * Format:
 * - "common name - additional name (<i>unique name</i>)"
 * - "<i>unique name</i> - additional" if no common name is specified.
 *
 * German common names are currently not supported.
 * @param plant DTO containing the most essential information of a plant.
 * @param seed DTO containing seed information.
 */
export function CompletePlantNameFormatted(props: {
  seed: SeedDto;
  plant: PlantsSummaryDto;
}): ReactElement {
  console.assert(props.seed.plant_id === props.plant.id);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const common_name = props.plant.common_name_en[0];

  return hasCommonName(props.plant) ? (
    <>
      {common_name} - {props.seed.name} ({formatUniqueName(props.plant.unique_name)})
    </>
  ) : (
    <>
      {formatUniqueName(props.plant.unique_name)} - {props.seed.name}
    </>
  );
}

/**
 * Unique names come from the backend as one string, but they may still contain two different parts.
 *
 * 1. The latin name of the plant This may either be the name of the species or of a single family.
 * 2. (Optional) A reference to the cultivar in single quotes.
 *
 * This function formats a unique name as a React component that displays the species name in italics and the cultivar
 * in single quotes.
 *
 * @param uniqueName The unique name
 */
function formatUniqueName(uniqueName: string): ReactElement {
  const uniqueNameParts = uniqueName.split("'");

  const species_or_family_name = uniqueNameParts[0].trim();
  const cultivar = uniqueNameParts[1]?.trim();

  return (
    <>
      <i>{species_or_family_name}</i>
      {!!cultivar && ` '${cultivar}'`}
    </>
  );
}

/**
 * Check if a PlantsSummaryDto has a common name attached.
 *
 * @param plant the DTO to be checked.
 */
function hasCommonName(plant: PlantsSummaryDto): boolean {
  return plant.common_name_en !== undefined && plant.common_name_en.length > 0;
}
