import type { DefaultLanguage, DefaultNamespace } from '..';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: DefaultNamespace;
    resources: DefaultLanguage;
  }
}
