import type { LocaleUtils } from '@pega/pcore-pconnect-typedefs/locale/locale-utils';
import type { publicConstants } from '@pega/pcore-pconnect-typedefs/constants';
import type DataApiUtils from '@pega/pcore-pconnect-typedefs/data-view/DataApiUtils';
import type { Meta, StoryObj } from '@storybook/react';

import SlDxExtensionsStarRatingWidget, {
  type SlDxExtensionsStarRatingWidgetProps
} from './index';

import historyData from './mock.historyData';
import type ActionsApi from '@pega/pcore-pconnect-typedefs/actions/api';
import type { DataResponse } from '@pega/pcore-pconnect-typedefs/data-view/types';

const meta: Meta<typeof SlDxExtensionsStarRatingWidget> = {
  title: 'SL/SlDxExtensionsStarRatingWidget',
  component: SlDxExtensionsStarRatingWidget
};

export default meta;
type Story = StoryObj<typeof SlDxExtensionsStarRatingWidget>;

const mockPCore: Partial<typeof PCore> = {};
if (!window.PCore) {
  window.PCore = mockPCore as typeof PCore;
}
const mockCaseInfo: Partial<(typeof publicConstants)['CASE_INFO']> = {
  CASE_INFO_ID: 'caseInfo.Id'
};
const mockConstants = (): Partial<typeof publicConstants> => {
  return { CASE_INFO: mockCaseInfo as (typeof publicConstants)['CASE_INFO'] };
};
window.PCore.getConstants = mockConstants as () => typeof publicConstants;

window.PCore.getLocaleUtils = () => {
  return {
    getLocaleValue: value => {
      return value;
    }
  } as LocaleUtils;
};

const mockDataApiUtils = (): Partial<typeof DataApiUtils> => {
  return {
    getData(dataViewName, payload, context, options): Promise<DataResponse> {
      console.log(dataViewName, payload, context, options);
      return new Promise(resolve => {
        resolve(historyData as DataResponse);
      });
    }
  };
};
window.PCore.getDataApiUtils = mockDataApiUtils as () => typeof DataApiUtils;

export const BaseSlDxExtensionsStarRatingWidget: Story = (
  args: SlDxExtensionsStarRatingWidgetProps
) => {
  const mockActionsApi = (): Partial<ActionsApi> => ({
    updateFieldValue: () => ({
      /* nothing */
    }),
    triggerFieldChange: () => {
      /* nothing */
    }
  });

  const mockPConnect = (): Partial<typeof PConnect> => ({
    getValue: value => {
      return value;
    },
    getContextName: () => {
      return 'app/primary_1';
    },
    getLocalizedValue: value => {
      return value;
    },
    getActionsApi: mockActionsApi as () => ActionsApi,
    ignoreSuggestion: () => {
      /* nothing */
    },
    acceptSuggestion: () => {
      /* nothing */
    },
    setInheritedProp: () => ({
      /* nothing */
    }),
    resolveConfigProps: () => ({
      /* nothing */
    })
  });

  const props = {
    getPConnect: mockPConnect as () => typeof PConnect
  };

  return <SlDxExtensionsStarRatingWidget {...props} {...args} />;
};

BaseSlDxExtensionsStarRatingWidget.args = {
  label: 'Case history'
};
