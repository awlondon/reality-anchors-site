import type { StorybookConfig } from '@storybook/nextjs';

/**
 * Storybook configuration scaffold.
 *
 * To activate:
 *   1. npm install --save-dev @storybook/nextjs @storybook/react @storybook/addon-essentials
 *   2. Add stories to components (e.g., components/Hero.stories.tsx)
 *   3. Run: npx storybook dev -p 6006
 */
const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
};

export default config;
