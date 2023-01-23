import { SelectOption } from '../features/seeds/components/Form/SelectMenu';

export function enumFromStringValue<T>(enm: { [s: string]: T }, value: string): T | undefined {
  return (Object.values(enm) as unknown as string[]).includes(value)
    ? (value as unknown as T)
    : undefined;
}

export function enumToSelectOptionArr<T>(obj: { [key: string]: T }): SelectOption[] {
  return Object.values(obj).map((element) => {
    return { value: `${element}`, label: `${element}` };
  });
}
