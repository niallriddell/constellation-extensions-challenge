import type { Meta, StoryObj } from '@storybook/react';

import { AxiosResponse } from 'axios';

import type CaseInfo from '@pega/pcore-pconnect-typedefs/case/case-info';
import type DataPageUtils from '@pega/pcore-pconnect-typedefs/datapage/index';
import type EnvironmentInfo from '@pega/pcore-pconnect-typedefs/environment-info/index';
import type RestClient from '@pega/pcore-pconnect-typedefs/rest-client';
import type SemanticUrlUtils from '@pega/pcore-pconnect-typedefs/router/semanticurl-utils';
import type PubSubUtils from '@pega/pcore-pconnect-typedefs/utils/pubsub-utils';
import type MessagingServiceManager from '@pega/pcore-pconnect-typedefs/messagingservice/manager';
import type { DataAsyncResponse } from '@pega/pcore-pconnect-typedefs/data-view/types';
import type { Filter } from '@pega/pcore-pconnect-typedefs/datapage/types';
import type { LocaleUtils } from '@pega/pcore-pconnect-typedefs/locale/locale-utils';
import type ContainerUtils from '@pega/pcore-pconnect-typedefs/container/container-utils';

import SlDxExtensionsStarRatingWidget, {
  type SlDxExtensionsStarRatingWidgetProps
} from './index';

import mockRatingData, { newRating } from './mock.ratingData';

const meta: Meta<typeof SlDxExtensionsStarRatingWidget> = {
  title: 'SL/Star Rating Widget',
  component: SlDxExtensionsStarRatingWidget
};

export default meta;
type Story = StoryObj<typeof SlDxExtensionsStarRatingWidget>;

const existingPCore = window.PCore;
const constants = existingPCore?.getConstants();

const mockContainerUtils = (): Partial<typeof ContainerUtils> => {
  return {
    areContainerItemsPresent: () => false
  };
};

window.PCore = {
  ...existingPCore,
  ...{
    getEnvironmentInfo: () => {
      return {
        getTimeZone: () => 'Europe/London'
      } as typeof EnvironmentInfo;
    },
    getConstants: () => {
      return {
        ...constants,
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
    },

    getLocaleUtils: () => {
      return {
        getLocaleValue: (value: string) => {
          return value;
        }
      } as LocaleUtils;
    }
  }
} as typeof PCore;

window.PCore.getContainerUtils =
  mockContainerUtils as () => typeof ContainerUtils;

const mockGetDataAsync = (
  ...args: any[]
): Promise<Partial<DataAsyncResponse>> => {
  const filter = args[4]?.filter as Filter;
  const queryCustomerID = filter?.filterConditions.F1.rhs.value;
  let { data } = mockRatingData;
  if (queryCustomerID?.length)
    data = data.filter(rating => rating.CustomerID === queryCustomerID);

  return Promise.resolve({ data, status: 200 });
};

const mockDataPageUtils = (): Partial<typeof DataPageUtils> => {
  return {
    getDataAsync: mockGetDataAsync as () => Promise<DataAsyncResponse>,
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
              : Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString()
          }
        }
      }) as Promise<AxiosResponse<any>>
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

window.PCore.getSemanticUrlUtils =
  mockSemanticUrlUtils as () => typeof SemanticUrlUtils;

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
      getKey: () => newRating.CaseID,
      getID: () => newRating.CaseID.split(' ')[1],
      getClassName: () => newRating.CaseClassName
    }) as CaseInfo
});

const mockMessagingServiceManager = (): Partial<
  typeof MessagingServiceManager
> => {
  return {
    subscribe: () => 'SubId',
    unsubscribe: () => {}
  };
};

// console.log(window.PCore);

window.PCore.getMessagingServiceManager =
  mockMessagingServiceManager as () => typeof MessagingServiceManager;

const createStarRatingWidgetStory = (
  args: SlDxExtensionsStarRatingWidgetProps
): Story => {
  const Template: Story = (storyArgs: SlDxExtensionsStarRatingWidgetProps) => {
    const props = {
      getPConnect: mockPConnect as () => typeof PConnect
    };
    storyArgs.label = `${args.label} for ${args.customerId}`;

    return <SlDxExtensionsStarRatingWidget {...props} {...storyArgs} />;
  };

  Template.args = args;
  return Template;
};

const defaultArgs: Partial<SlDxExtensionsStarRatingWidgetProps> = {
  label: 'Ratings',
  ratingDataClass: 'SL-TellUsMore-Data-CustomerRating',
  ratingLookupDatapage: ['D_CustomerRating'],
  ratingListDatapage: ['D_CustomerRatingList'],
  ratingSavableDatapage: ['D_CustomerRatingSavable']
};

export const WithCurrentCaseRating = createStarRatingWidgetStory({
  ...defaultArgs,
  customerId: 'Q1234'
} as SlDxExtensionsStarRatingWidgetProps);

export const WithoutCurrentCaseRating = createStarRatingWidgetStory({
  ...defaultArgs,
  customerId: 'Q123'
} as SlDxExtensionsStarRatingWidgetProps);
