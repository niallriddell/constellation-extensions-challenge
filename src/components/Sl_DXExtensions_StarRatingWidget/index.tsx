import { useState, useEffect } from 'react';

import { Table, withConfiguration } from '@pega/cosmos-react-core';
import type { Payload } from '@pega/pcore-pconnect-typedefs/data-view/types';
import type { Parameters } from '@pega/pcore-pconnect-typedefs/datapage/types';

import type { PConnFieldProps } from './PConnProps';
import './create-nonce';

import handleResponse from './dataUtils';

// import {
//   type RatingDataItem as DataItem,
//   createRatingTableSchema as createTableSchema,
//   RatingTableRow as TableRow,
//   mapRatingDataItem as mapDataItem
// } from './ratingData';

import {
  createHistoryTableSchema as createTableSchema,
  mapHistoryDataItem as mapDataItem
} from './historyData';

import type {
  HistoryTableRow as TableRow,
  HistoryDataItem as DataItem
} from './historyData';

// interface for props
export interface SlDxExtensionsStarRatingWidgetProps extends PConnFieldProps {
  listDataPage: string;
  // If any, enter additional props that only exist on TextInput here
}

function SlDxExtensionsStarRatingWidget(
  props: Readonly<SlDxExtensionsStarRatingWidgetProps>
) {
  const { getPConnect, label, listDataPage = 'D_CustomerRatingList' } = props;
  const pConn = getPConnect();
  const [data, setData] = useState<TableRow['data']>();
  const [isLoading, setIsLoading] = useState(true);
  const caseProp: string = PCore.getConstants().CASE_INFO.CASE_INFO_ID;
  const caseID: string = pConn.getValue(caseProp, '');
  const context = pConn.getContextName();

  const columns = createTableSchema(getPConnect);

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
    <Table
      title={pConn.getLocalizedValue(label, '', '')}
      columns={columns}
      data={data}
      loading={isLoading}
      loadingMessage={pConn.getLocalizedValue('Loading data ...')}
    />
  );
}

export default withConfiguration(SlDxExtensionsStarRatingWidget);
