import filterObject from '../../../utils/filterObject';
import { useTranslation } from 'react-i18next';
import Select, { ClassNamesConfig, SingleValueProps, StylesConfig } from 'react-select';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
];

type Option = (typeof languages)[number];

// since we render our own menu, we filter out all styles that are not needed
const customStyles: StylesConfig<Option, false> = {
  option: (styles) => filterObject(styles, ['backgroundColor', 'color']),
  control: () => ({}),
  valueContainer: () => ({}),
  menu: (styles) => filterObject(styles, ['width', 'height']),
};

const customClassNames: ClassNamesConfig<Option, false> = {
  option: (state) => {
    return `
        hover:bg-neutral-200 dark:hover:bg-neutral-400-dark
        ${state.isFocused ? ' bg-neutral-300 dark:bg-neutral-500' : ''}
        ${state.isSelected ? ' bg-primary-500' : ''}
      `;
  },
  menu: () => 'bg-white dark:bg-neutral-100-dark',
  control: (state) => {
    const controlClassName =
      'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 bg-transparent rounded-lg inline-flex items-center';

    return `
        ${controlClassName}
        ${state.isFocused ? ' bg-neutral-300 dark:bg-neutral-500' : ''}
    `;
  },
  valueContainer: () => 'w-7',
};

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const selectedLanguage = languages.find((lang) => lang.value === i18n.resolvedLanguage);

  return (
    <Select
      components={{
        IndicatorSeparator: null,
        SingleValue,
      }}
      hideSelectedOptions={false}
      isClearable={false}
      isSearchable={false}
      tabSelectsValue={false}
      onChange={(newValue) => {
        if (!newValue) return;

        i18n.changeLanguage(newValue.value);
      }}
      options={languages}
      placeholder=""
      styles={customStyles}
      classNames={customClassNames}
      value={selectedLanguage}
    />
  );
}

const SingleValue = ({ getValue }: SingleValueProps<Option, false>) => {
  return (
    <span className="select-none pl-2" data-testid={`language-switcher__${getValue()[0].value}`}>
      {getValue()[0].value}
    </span>
  );
};
