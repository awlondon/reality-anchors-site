import type { Preview } from '@storybook/react';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#070b12' },
        { name: 'card', value: '#111d2c' },
      ],
    },
  },
};

export default preview;
