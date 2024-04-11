import { ReactElement } from 'react';
import { PlantsSummaryDto, SeedDto } from '@/api_types/definitions';

/**
 * Gets the common name from a PlantsSummaryDto according to the language.
 *
 * Uses the english common name as a fallback, if no german common name is available.
 * If no common name is available, an empty string is returned.
 *
 * @param plant DTO containing the most essential information of a plant.
 */
export function getCommonName(plant: PlantsSummaryDto, language: string): string {
  let commonName;

  if (language === 'de') {
    commonName = capitalizeCommonName(plant.common_name_de);
  }

  // use english common name as a fallback or if language is set to english
  commonName = commonName ? commonName : capitalizeCommonName(plant.common_name_en);

  return commonName ? commonName : '';
}

/**
 * Gets the common name from a PlantsSummaryDto according to the language.
 *
 * Uses the english common name as a fallback, if no german common name is available.
 * If no common name is available either, the unique name is returned.
 *
 * @param plant DTO containing the most essential information of a plant.
 */
export function getCommonOrUniqueName(plant: PlantsSummaryDto, language: string): string {
  const commonName = getCommonName(plant, language);

  return commonName ? commonName : plant.unique_name;
}

/**
 * Generate a partial plant name from a PlantsSummaryDto.
 * Chooses the common name according to the language
 * Format:
 * - "common name (unique name)"
 * - "unique name" if no common name is specified.
 *
 * @param plant DTO containing the most essential information of a plant.
 */
export function getNameFromPlant(plant: PlantsSummaryDto, language: string): string {
  const commonName = getCommonName(plant, language);

  return hasCommonName(plant) ? `${commonName} (${plant.unique_name})` : plant.unique_name;
}

/**
 * Component representing an HTML formatted partial plant name.
 * Chooses the common name according to the language
 *
 * Format:
 * - "common name (<i>unique name</i>)"
 * - "unique name" if no common name is specified.
 */
export function PlantNameFromPlant(props: {
  plant: PlantsSummaryDto;
  language: string;
}): ReactElement {
  const commonName = getCommonName(props.plant, props.language);

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
 * Chooses the common name according to the language
 *
 * Format:
 * - "common name - additional name (unique name)"
 * - "unique name - additional name" if no common name is specified.
 *
 * @param plant DTO containing the most essential information of a plant.
 * @param seed DTO containing seed information.
 */
export function getPlantNameFromSeedAndPlant(
  seed: SeedDto,
  plant: PlantsSummaryDto,
  language: string,
): string {
  const commonName = getCommonName(plant, language);

  return hasCommonName(plant)
    ? `${commonName} - ${seed.name} (${plant.unique_name})`
    : `${plant.unique_name} - ${seed.name}`;
}

/**
 * Generate a complete plant name from a PlantsSummaryDto and its additional name.
 * Chooses the common name according to the language
 *
 * Format:
 * - "common name - additional name (unique name)"
 * - "unique name - additional name" if no common name is specified.
 *
 * @param plant DTO containing the most essential information of a plant.
 * @param additionalName DTO containing seed information.
 */
export function getPlantNameFromAdditionalNameAndPlant(
  additionalName: string,
  plant: PlantsSummaryDto,
  language: string,
): string {
  const commonName = getCommonName(plant, language);

  return hasCommonName(plant)
    ? `${commonName} - ${additionalName} (${plant.unique_name})`
    : `${plant.unique_name} - ${additionalName}`;
}

/**
 * Component representing an HTML formatted complete plant name given a PlantsSummaryDto and SeedDto.
 * Chooses the common name according to the language
 *
 * Format:
 * - "common name - additional name (<i>unique name</i>)"
 * - "<i>unique name</i> - additional" if no common name is specified.
 */
export function PlantNameFromSeedAndPlant(props: {
  seed: SeedDto;
  plant: PlantsSummaryDto;
  language: string;
}): ReactElement {
  const commonName = getCommonName(props.plant, props.language);

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
 * Component representing an HTML formatted complete plant name given a PlantsSummaryDto and additional name.
 * Chooses the common name according to the language
 *
 * Format:
 * - "common name - additional name (<i>unique name</i>)"
 * - "<i>unique name</i> - additional name" if no common name is specified.
 */
export function PlantNameFromAdditionalNameAndPlant(props: {
  additionalName: string;
  plant: PlantsSummaryDto;
  language: string;
}): ReactElement {
  const commonName = getCommonName(props.plant, props.language);

  return hasCommonName(props.plant) ? (
    <>
      {commonName} - {props.additionalName} (
      <UniqueNameFromPlant uniqueName={props.plant.unique_name} />)
    </>
  ) : (
    <>
      <UniqueNameFromPlant uniqueName={props.plant.unique_name} /> - {props.additionalName}
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
