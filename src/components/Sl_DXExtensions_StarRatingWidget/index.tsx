import { useState, useEffect } from 'react';

import {
  SummaryList,
  withConfiguration,
  SummaryListItem
} from '@pega/cosmos-react-core';
import type { Payload } from '@pega/pcore-pconnect-typedefs/data-view/types';
import type { Parameters } from '@pega/pcore-pconnect-typedefs/datapage/types';

import type { PConnFieldProps } from './PConnProps';

import handleResponse from './dataUtils';

import {
  type RatingDataItem as DataItem,
  mapRatingDataItem as mapDataItem
} from './ratingData';

// interface for props
export interface SlDxExtensionsStarRatingWidgetProps extends PConnFieldProps {
  listDataPage: string;
  // If any, enter additional props that only exist on TextInput here
}

function SlDxExtensionsStarRatingWidget(
  props: SlDxExtensionsStarRatingWidgetProps
) {
  const { getPConnect, label, listDataPage } = props;
  const pConn = getPConnect();
  const [data, setData] = useState<SummaryListItem[]>();
  const [isLoading, setIsLoading] = useState(true);
  const caseProp: string = PCore.getConstants().CASE_INFO.CASE_INFO_ID;
  const caseID: string = pConn.getValue(caseProp, '');
  const context = pConn.getContextName();

  // const columns = createTableSchema(getPConnect);

  useEffect(() => {
    const parameters: Parameters = { CaseInstanceKey: caseID };
    const payload: Payload = { dataViewParameters: parameters };

    PCore.getDataApiUtils()
      .getData(listDataPage, payload, context)
      .then(response => {
        setData(handleResponse(response.data.data as DataItem[], mapDataItem));
      })
      .catch(() => setData([]))
      .finally(() => setIsLoading(false));
  }, [caseID, context, listDataPage]);

  return (
    <SummaryList
      name={label}
      count={isLoading ? 0 : data?.length}
      loading={isLoading}
      items={data ?? []}
    />
  );
}

export default withConfiguration(SlDxExtensionsStarRatingWidget);
