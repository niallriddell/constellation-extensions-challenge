// @ts-nocheck
// we wikll be adding typescript checks back in future branches
import type { Meta, StoryObj } from '@storybook/react';

import SlDxExtensionsStarRatingWidget from './index';

import historyData from './mock';

const meta: Meta<typeof SlDxExtensionsStarRatingWidget> = {
  title: 'SlDxExtensionsStarRatingWidget',
  component: SlDxExtensionsStarRatingWidget,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof SlDxExtensionsStarRatingWidget>;

if (!window.PCore) {
  window.PCore = {};
}

window.PCore.getConstants = () => {
  return {
    CASE_INFO: {
      CASE_INFO_ID: 'caseInfo.ID'
    }
  };
};

window.PCore.getLocaleUtils = () => {
  return {
    getLocaleValue: value => {
      return value;
    }
  };
};

window.PCore.getDataApiUtils = () => {
  return {
    getData: () => Promise.resolve(historyData)
  };
};

export const BaseSlDxExtensionsStarRatingWidget: Story = args => {
  const props = {
    getPConnect: () => {
      return {
        getValue: value => {
          return value;
        },
        getContextName: () => {
          return 'app/primary_1';
        },
        getLocalizedValue: value => {
          return value;
        },
        getActionsApi: () => {
          return {
            updateFieldValue: () => {
              /* nothing */
            },
            triggerFieldChange: () => {
              /* nothing */
            }
          };
        },
        ignoreSuggestion: () => {
          /* nothing */
        },
        acceptSuggestion: () => {
          /* nothing */
        },
        setInheritedProps: () => {
          /* nothing */
        },
        resolveConfigProps: () => {
          /* nothing */
        }
      };
    }
  };

  return <SlDxExtensionsStarRatingWidget {...props} {...args} />;
};

BaseSlDxExtensionsStarRatingWidget.args = {
  label: 'Case history'
};
