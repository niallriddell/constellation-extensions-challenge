const path = require('path'); // Import the path module
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/preset-typescript'],
  framework: {
    name: '@storybook/react-webpack5'
  },
  webpackFinal: async config => {
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, '../src'),
      'node_modules'
    ];
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  }
};
///** @type { import('@storybook/react-webpack5').StorybookConfig } */
//const config = {
//  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
//  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/preset-typescript'],
//  framework: {
//    name: '@storybook/react-webpack5'
//  },
//  docs: {
//    autodocs: 'tag'
//  }
//};
//export default config;
