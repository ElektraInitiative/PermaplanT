import { PlantsSummaryDto, SeedDto } from '@/api_types/definitions';
import { ReactElement } from 'react';

/**
 * Gets the common name from a PlantsSummaryDto.
 *
 * German common names are currently not supported.
 * @param plant DTO containing the most essential information of a plant.
 */
export function commonName(plant: PlantsSummaryDto): string {
  const commonName = capitalizeCommonName(plant.common_name_en);

  return hasCommonName(plant) ? commonName ?? '' : '';
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
export function getNameFromPlant(plant: PlantsSummaryDto): string {
  const commonName = capitalizeCommonName(plant.common_name_en);

  return hasCommonName(plant) ? `${commonName} (${plant.unique_name})` : plant.unique_name;
}

/**
 * Component representing an HTML formatted partial plant name.
 * Format:
 * - "common name (<i>unique name</i>)"
 * - "unique name" if no common name is specified.
 *
 * German common names are currently not supported.
 */
export function PlantNameFromPlant(props: { plant: PlantsSummaryDto }): ReactElement {
  const commonName = capitalizeCommonName(props.plant.common_name_en);

  return hasCommonName(props.plant) ? (
    <>
      {commonName} (<UniqueNameFromPlant uniqueName={props.plant.unique_name} />)
    </>
  ) : (
    <UniqueNameFromPlant uniqueName={props.plant.unique_name} />
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
export function getPlantNameFromSeedAndPlant(seed: SeedDto, plant: PlantsSummaryDto): string {
  const commonName = capitalizeCommonName(plant.common_name_en);

  return hasCommonName(plant)
    ? `${commonName} - ${seed.name} (${plant.unique_name})`
    : `${plant.unique_name} - ${seed.name}`;
}

/**
 * Component representing an HTML formatted complete plant name given a PlantsSummaryDto.
 * Format:
 * - "common name - additional name (<i>unique name</i>)"
 * - "<i>unique name</i> - additional" if no common name is specified.
 *
 * German common names are currently not supported.
 */
export function PlantNameFromSeedAndPlant(props: {
  seed: SeedDto;
  plant: PlantsSummaryDto;
}): ReactElement {
  const commonName = capitalizeCommonName(props.plant.common_name_en);

  return hasCommonName(props.plant) ? (
    <>
      {commonName} - {props.seed.name} (
      <UniqueNameFromPlant uniqueName={props.plant.unique_name} />)
    </>
  ) : (
    <>
      <UniqueNameFromPlant uniqueName={props.plant.unique_name} /> - {props.seed.name}
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
export function UniqueNameFromPlant(props: { uniqueName: string }): ReactElement {
  const uniqueNameParts = props.uniqueName.split("'");

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
 * Make sure that the common name starts with a capital letter.
 *
 * @param commonName The common name
 */
function capitalizeCommonName(commonName: string[] | undefined): string | undefined {
  return commonName?.[0]?.charAt(0).toUpperCase().concat(commonName?.[0]?.slice(1));
}

/**
 * Check if a PlantsSummaryDto has a common name attached.
 *
 * @param plant the DTO to be checked.
 */
export function hasCommonName(plant: PlantsSummaryDto): boolean {
  const commonNameLength = plant.common_name_en?.[0]?.trim().length ?? 0;
  return commonNameLength > 0;
}
