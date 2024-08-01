import type { LocaleUtils } from '@pega/pcore-pconnect-typedefs/locale/locale-utils';
import type { publicConstants } from '@pega/pcore-pconnect-typedefs/constants';
import type DataApiUtils from '@pega/pcore-pconnect-typedefs/data-view/DataApiUtils';
import type { Meta, StoryObj } from '@storybook/react';

import SlDxExtensionsStarRatingWidget, {
  type SlDxExtensionsStarRatingWidgetProps
} from './index';

import mockRatingData, { newRating } from './mock.ratingData';
import type ActionsApi from '@pega/pcore-pconnect-typedefs/actions/api';
import type { DataResponse } from '@pega/pcore-pconnect-typedefs/data-view/types';
import type CaseInfo from '@pega/pcore-pconnect-typedefs/case/case-info';

const meta: Meta<typeof SlDxExtensionsStarRatingWidget> = {
  title: 'SL/Star Rating Widget',
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
    getData(...args): Promise<DataResponse> {
      const customerId = args[1]?.dataViewParameters?.CustomerID;
      const newMockRatingData = customerId
        ? JSON.parse(JSON.stringify(mockRatingData))
        : mockRatingData;
      if (newMockRatingData !== mockRatingData)
        newMockRatingData.data.data = mockRatingData.data.data.filter(
          item => item.CustomerID === customerId
        );
      return new Promise(resolve => {
        resolve(newMockRatingData as DataResponse);
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
  const mockCaseInfo = (): Partial<CaseInfo> => ({
    getKey: () => newRating.CaseID,

    getClassName: () => newRating.CaseClassName
  });

  const mockPConnect = (): Partial<typeof PConnect> => ({
    getCaseInfo: mockCaseInfo as () => CaseInfo,
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
  label: 'Rating history',
  listDataPage: 'D_RatingList',
  customerId: 'Q123'
};
