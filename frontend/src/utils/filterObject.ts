import { FieldValues } from 'react-hook-form';

/**
 * filter the key value pairs of an object with a blacklist of keys
 * @param raw: raw object that will be filtered
 * @param blacklist: list of keys which are used to filter the raw object
 * @return new object which no longer contains the blacklisted key value pairs
 */
const filterObject = (raw: FieldValues, blacklist: Array<keyof FieldValues>) => {
  return Object.keys(raw)
    .filter((key) => !blacklist.includes(key))
    .reduce((obj, key) => {
      obj[key] = raw[key];
      return obj;
    }, {} as FieldValues);
};

export default filterObject;
