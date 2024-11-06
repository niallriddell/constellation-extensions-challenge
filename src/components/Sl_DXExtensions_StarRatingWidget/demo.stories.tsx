import type { Meta, StoryObj } from '@storybook/react';

import type CaseInfo from '@pega/pcore-pconnect-typedefs/case/case-info';
import type DataPageUtils from '@pega/pcore-pconnect-typedefs/datapage/index';
import type { Filter } from '@pega/pcore-pconnect-typedefs/datapage/types';
import type { LocaleUtils } from '@pega/pcore-pconnect-typedefs/locale/locale-utils';
import type EnvironmentInfo from '@pega/pcore-pconnect-typedefs/environment-info/index';
import type RestClient from '@pega/pcore-pconnect-typedefs/rest-client';
import type SemanticUrlUtils from '@pega/pcore-pconnect-typedefs/router/semanticurl-utils';
import type ContainerUtils from '@pega/pcore-pconnect-typedefs/container/container-utils';

import SlDxExtensionsStarRatingWidget, {
  type SlDxExtensionsStarRatingWidgetProps
} from './index';

import mockRatingData, { newRating } from './mock.ratingData';
import type { DataAsyncResponse } from '@pega/pcore-pconnect-typedefs/data-view/types';
import { AxiosResponse } from 'axios';

const meta: Meta<typeof SlDxExtensionsStarRatingWidget> = {
  title: 'SL/Star Rating Widget',
  component: SlDxExtensionsStarRatingWidget,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof SlDxExtensionsStarRatingWidget>;

const mockPCore: Partial<typeof PCore> = {};

if (!window.PCore) {
  window.PCore = mockPCore as typeof PCore;
}

const mockContainerUtils = (): Partial<typeof ContainerUtils> => {
  return {
    areContainerItemsPresent: () => false
  };
};

window.PCore.getContainerUtils =
  mockContainerUtils as () => typeof ContainerUtils;

window.PCore.getEnvironmentInfo = () => {
  return {
    getTimeZone: () => 'Europe/London'
  } as typeof EnvironmentInfo;
};

window.PCore.getConstants = () => {
  return {
    CASE_INFO: {
      CASE_INFO_ID: 'caseInfo.ID'
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

const mockGetDataAsync = (
  ...args: any[]
): Promise<Partial<DataAsyncResponse>> => {
  const filter = args[4]?.filter as Filter;
  const queryCustomerID = filter?.filterConditions.F1.rhs.value;
  let { data } = mockRatingData;
  if (queryCustomerID && queryCustomerID.length)
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

export const StarRatingWidgetWithCurrentCaseRating: Story = (
  args: SlDxExtensionsStarRatingWidgetProps
) => {
  const props = {
    getPConnect: mockPConnect as () => typeof PConnect
  };

  return (
    <>
      <SlDxExtensionsStarRatingWidget {...props} {...args} />
    </>
  );
};

StarRatingWidgetWithCurrentCaseRating.args = {
  label: 'Ratings',
  customerId: 'Q1234',
  ratingDataClass: 'SL-TellUsMore-Data-CustomerRating',
  ratingLookupDatapage: ['D_CustomerRating'],
  ratingListDatapage: ['D_CustomerRatingList'],
  ratingSavableDatapage: ['D_CustomerRatingSavable']
};

export const StarRatingWidgetWithoutCurrentCaseRating: Story = (
  args: SlDxExtensionsStarRatingWidgetProps
) => {
  const props = {
    getPConnect: mockPConnect as () => typeof PConnect
  };

  return (
    <>
      <SlDxExtensionsStarRatingWidget {...props} {...args} />
    </>
  );
};

StarRatingWidgetWithoutCurrentCaseRating.args = {
  label: 'Ratings',
  customerId: 'Q123',
  ratingDataClass: 'SL-TellUsMore-Data-CustomerRating',
  ratingLookupDatapage: ['D_CustomerRating'],
  ratingListDatapage: ['D_CustomerRatingList'],
  ratingSavableDatapage: ['D_CustomerRatingSavable']
};
