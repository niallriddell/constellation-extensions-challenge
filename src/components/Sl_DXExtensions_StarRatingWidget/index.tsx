import { useState, useEffect } from 'react';

import {
  // registerIcon,
  SummaryList,
  withConfiguration
} from '@pega/cosmos-react-core';

import type { Payload } from '@pega/pcore-pconnect-typedefs/data-view/types';
import type { Parameters } from '@pega/pcore-pconnect-typedefs/datapage/types';
// import * as star from '@pega/cosmos-react-core/lib/components/Icon/icons/star.icon';

import type { PConnFieldProps } from './PConnProps';
import './create-nonce';
import createItems from './dataUtils';
import {
  type RatingDataItem as DataItem,
  mapRatingDataItem as mapDataItem
} from './ratingData';

// registerIcon(star);

// interface for props
export interface SlDxExtensionsStarRatingWidgetProps extends PConnFieldProps {
  listDataPage: string;
  customerId: string;
  // If any, enter additional props that only exist on TextInput here
}

function SlDxExtensionsStarRatingWidget(
  props: SlDxExtensionsStarRatingWidgetProps
) {
  const { getPConnect, label, listDataPage, customerId } = props;
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const context = getPConnect().getContextName();

  useEffect(() => {
    const parameters: Parameters = { CustomerID: customerId };
    const payload: Payload = { dataViewParameters: parameters };

    PCore.getDataApiUtils()
      .getData(listDataPage, payload, context)
      .then(response => {
        setData(response.data.data as DataItem[]);
      })
      .catch(() => setData([]))
      .finally(() => setIsLoading(false));
  }, [customerId, context, listDataPage]);

  const items = createItems(data, mapDataItem);

  return (
    <SummaryList
      key={`summaryList-${customerId}`}
      // icon='star'
      name={label}
      count={isLoading ? 0 : data?.length}
      loading={isLoading}
      items={items ?? []}
    />
  );
}

export default withConfiguration(SlDxExtensionsStarRatingWidget);
