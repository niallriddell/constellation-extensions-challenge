import type { Meta, StoryObj } from '@storybook/react';

import SlDxExtensionsNavigateToStep from './index';
import configProps from './mock';

const meta: Meta = {
  title: 'SL/Navigate to step',
  component: SlDxExtensionsNavigateToStep,
  parameters: {
    controls: { expanded: true }
  }
};

export default meta;

type Story = StoryObj<typeof SlDxExtensionsNavigateToStep>;

export const WithASingleStep: Story = {
  args: {
    text: configProps.text ?? '',
    tooltip: configProps.tooltip,
    stepID: configProps.stepID ?? '',
    variant: configProps.variant,
    icon: configProps.icon,
    iconName: configProps.iconName,
    getPConnect: () => {
      return {
        getActionsApi: () => {
          return {
            navigateToStep: (stepID, containerItemID) => {
              if (stepID === 'ERROR') {
                return Promise.reject(new Error('Error navigating to step'));
              }
              return Promise.resolve(
                console.log(
                  `Navigating to stepID: ${stepID} with containerItemID: ${containerItemID}`
                )
              );
            }
          };
        },
        getLocalizedValue: name => name,
        getContextName: () => 'containerItemID'
      } as typeof PConnect;
    }
  }
};
