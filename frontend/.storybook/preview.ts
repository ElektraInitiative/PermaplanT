import { Preview } from '@storybook/react';
import '../src/styles/globals.css';
import './storybook.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        // careful this is case sensitive
        order: ['docs', ['Readme', '*'], 'Components', '*'],
        locales: 'en-US',
      },
    },
    darkMode: {
      // enable dark mode for all stories
      classTarget: 'html',
      stylePreview: true,
    },
  },
};

export default preview;
