import type { Meta, StoryObj } from '@storybook/react';

import { LocaleUtils } from '@pega/pcore-pconnect-typedefs/locale/locale-utils';
import AssetLoader from '@pega/pcore-pconnect-typedefs/utils/asset-loader';

import SlDxExtensionsNavigateWrapper from './index';
import reviewInner from './mock';

import SlDXExtensionsNavigateToStep from '../Sl_DXExtensions_NavigateToStep';

const meta: Meta<typeof SlDxExtensionsNavigateWrapper> = {
  title: 'SL/Navigate to step wrapper',
  component: SlDxExtensionsNavigateWrapper,
  parameters: {
    controls: { expanded: true }
  }
};

export default meta;
type Story = StoryObj<typeof SlDxExtensionsNavigateWrapper>;

const existingPCore = window.PCore;
const constants = existingPCore?.getConstants();

window.PCore = {
  ...existingPCore,
  ...{
    getLocaleUtils: () => {
      return {
        getLocaleValue: (text: string) => text
      } as LocaleUtils;
    },
    getComponentsRegistry: () => {
      return {
        getCustomComponent: () => () => SlDXExtensionsNavigateToStep
      } as any;
    },
    getAssetLoader: () => {
      return {
        getLoader:
          (name): Function =>
          () =>
            Promise.resolve(name)
      } as typeof AssetLoader;
    },
    getConstants: () => {
      return {
        ...constants,
        CASE_INFO: {
          NAVIGATION: 'caseInfo.navigation'
        }
      } as Readonly<any>;
    }
  }
} as typeof PCore;

export const WrappingViewsAndAddingNavigation: Story = {
  args: {
    label: 'Test Details',
    showLabel: true,
    getPConnect: (): typeof PConnect => {
      return {
        getChildren: () => reviewInner.children,
        getInheritedProps: () => ({}),
        getLocalizedValue: (text: string) => text,
        getRawMetadata: () => reviewInner,
        hasChildren: () => true,
        getValue: () => []
      } as any;
    }
  }
};
