import type { Meta, StoryObj } from '@storybook/react';

import type CaseInfo from '@pega/pcore-pconnect-typedefs/case/case-info';
import type DataPageUtils from '@pega/pcore-pconnect-typedefs/datapage/index';
import type { Filter } from '@pega/pcore-pconnect-typedefs/datapage/types';
import type { LocaleUtils } from '@pega/pcore-pconnect-typedefs/locale/locale-utils';
import type RestClient from '@pega/pcore-pconnect-typedefs/rest-client/index';
import type SemanticUrlUtils from '@pega/pcore-pconnect-typedefs/router/semanticurl-utils';
import type PubSubUtils from '@pega/pcore-pconnect-typedefs/utils/pubsub-utils';

import SlDxExtensionsStarRatingsWidget, {
  type SlDxExtensionsStarRatingsWidgetProps
} from './index';

import ratingData from './mock';
import type MessagingServiceManager from '@pega/pcore-pconnect-typedefs/messagingservice/manager';

import { AxiosResponse } from 'axios';

const meta: Meta<typeof SlDxExtensionsStarRatingsWidget> = {
  title: 'SL/Star Rating Widget',
  component: SlDxExtensionsStarRatingsWidget,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof SlDxExtensionsStarRatingsWidget>;

const mockPCore: Partial<typeof PCore> = {};

if (!window.PCore) {
  window.PCore = mockPCore as typeof PCore;
}

window.PCore.getConstants = () => {
  return {
    CASE_INFO: {
      CASE_INFO_ID: 'caseInfo.ID'
    },
    PUB_SUB_EVENTS: {
      DATA_EVENTS: {
        DATA_OBJECT_CREATED: 'created',
        DATA_OBJECT_UPDATED: 'updated'
      }
    }
  } as Readonly<any>;
};

window.PCore.getLocaleUtils = () => {
  return {
    getLocaleValue: (value: string) => {
      return value;
    }
  } as LocaleUtils;
};

const mockDataPageUtils = (): Partial<typeof DataPageUtils> => {
  return {
    getDataAsync: (...args) => {
      const filter = args[4]?.filter as Filter;
      const queryCustomerID = filter?.filterConditions.F1.rhs.value;
      let { data } = ratingData;
      if (queryCustomerID && queryCustomerID.length)
        data = data.filter(rating => rating.CustomerID === queryCustomerID);

      return Promise.resolve({ data, status: 200 });
    },
    getPageDataAsync: () => Promise.resolve({ data: {}, status: 200 })
  };
};

window.PCore.getDataPageUtils = mockDataPageUtils as () => typeof DataPageUtils;

const mockRestClient = (): Partial<typeof RestClient> => {
  return {
    invokeRestApi: (...args) =>
      Promise.resolve({
        status: 200,
        data: {
          responseData: {
            ...args[1].body.data,
            pyGUID: args[1].body.data.pyGUID
              ? args[1].body.data.pyGUID
              : Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(),
            pxUpdateDateTime: new Date().toISOString()
          }
        }
      } as AxiosResponse)
  };
};

window.PCore.getRestClient = mockRestClient as () => typeof RestClient;

const mockSemanticUrlUtils = (): Partial<typeof SemanticUrlUtils> => {
  return {
    getResolvedSemanticURL: () => '',
    getActions: () => ({
      ACTION_OPENWORKBYHANDLE: 'Test',
      ACTION_SHOWDATA: 'Test',
      ACTION_SHOWVIEW: 'Test'
    })
  };
};

window.PCore.getSemanticUrlUtils = mockSemanticUrlUtils as () => typeof SemanticUrlUtils;

const mockPubSubUtils = (): Partial<typeof PubSubUtils> => {
  return {
    publish: (...args) => {
      console.log(args);
    },
    subscribe: (...args) => {
      console.log(args);
    },
    unsubscribe: (...args) => {
      console.log(args);
    }
  };
};
window.PCore.getPubSubUtils = mockPubSubUtils as () => typeof PubSubUtils;

const mockPConnect = (): Partial<typeof PConnect> => ({
  getValue: (value: string) => {
    return value;
  },
  getContextName: () => {
    return 'app/primary_1';
  },
  getLocalizedValue: (value: string) => {
    return value;
  },
  getCaseInfo: () =>
    ({
      getKey: () => 'SL-TELLUSMORE-WORK Z-1234',
      getClassName: () => 'SL-TellUseMore-Work-Incident'
    }) as CaseInfo
});

const mockMessagingServiceManager = (): Partial<typeof MessagingServiceManager> => {
  return {
    subscribe: () => 'SubId',
    unsubscribe: () => {}
  };
};

window.PCore.getMessagingServiceManager =
  mockMessagingServiceManager as () => typeof MessagingServiceManager;

export const StarRatingsWidgetWithCurrentCaseRating: Story = (
  args: SlDxExtensionsStarRatingsWidgetProps
) => {
  const props = {
    getPConnect: mockPConnect as () => typeof PConnect
  };

  return <SlDxExtensionsStarRatingsWidget {...props} {...args} />;
};

StarRatingsWidgetWithCurrentCaseRating.args = {
  label: 'Ratings',
  customerId: 'Q1234',
  ratingDataClass: 'SL-TellUsMore-Data-CustomerRating',
  ratingLookupDatapage: ['D_CustomerRating'],
  ratingListDatapage: ['D_CustomerRatingList'],
  ratingSavableDatapage: ['D_CustomerRatingSavable']
};

export const StarRatingsWidgetWithoutCurrentCaseRating: Story = (
  args: SlDxExtensionsStarRatingsWidgetProps
) => {
  const props = {
    getPConnect: mockPConnect as () => typeof PConnect
  };

  return <SlDxExtensionsStarRatingsWidget {...props} {...args} />;
};

StarRatingsWidgetWithoutCurrentCaseRating.args = {
  label: 'Ratings',
  customerId: 'Q123',
  ratingDataClass: 'SL-TellUsMore-Data-CustomerRating',
  ratingLookupDatapage: ['D_CustomerRating'],
  ratingListDatapage: ['D_CustomerRatingList'],
  ratingSavableDatapage: ['D_CustomerRatingSavable']
};
