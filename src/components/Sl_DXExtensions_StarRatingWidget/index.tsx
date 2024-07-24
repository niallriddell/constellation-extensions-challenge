import { useState, useEffect } from 'react';
import { Table, Text, withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';

import type { Payload } from '@pega/pcore-pconnect-typedefs/data-view/types';
import type { Parameters } from '@pega/pcore-pconnect-typedefs/datapage/types';
import type {
  DefaultRowData,
  TableProps
} from '@pega/cosmos-react-core/lib/components/Table/Table';
import { AxiosResponse } from 'axios';

type HistoryDataItem = {
  pxTimeCreated: string;
  pxObjClass: string;
  pyPerformer: string;
  pxInsName: string;
  pxLongitude: string | null;
  pzInsKey: string;
  pxHistoryForReference: string;
  pyMessageKey: string;
  pyMemo: string | null;
  pxLatitude: string | null;
};

interface HistoryTableRow extends DefaultRowData {
  date: string;
  description: string | JSX.Element;
  user: string;
}

// Generic handleResponse function
const handleResponse = <T, U>(
  data: T[],
  mapFunction: (entry: T, index: number) => U
): U[] => (data ? data.map(mapFunction) : []);

const mapHistoryDataItem = (
  entry: HistoryDataItem,
  index: number
): HistoryTableRow => ({
  date: new Date(entry.pxTimeCreated).toLocaleString(),
  description: (
    <Text style={{ wordBreak: 'break-word' }}>{entry.pyMessageKey}</Text>
  ),
  user: entry.pyPerformer,
  id: index
});

// interface for props
export interface SlDxExtensionsStarRatingWidgetProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
}

function SlDxExtensionsStarRatingWidget(
  props: SlDxExtensionsStarRatingWidgetProps
) {
  const { getPConnect, label } = props;
  const pConn = getPConnect();
  const [history, setHistory] = useState<TableProps<HistoryTableRow>['data']>();
  const [isLoading, setIsLoading] = useState(true);
  const caseProp: string = PCore.getConstants().CASE_INFO.CASE_INFO_ID;
  const caseID: string = pConn.getValue(caseProp, '');
  const context = pConn.getContextName();

  const columns: TableProps<HistoryTableRow>['columns'] = [
    {
      renderer: 'date',
      label: pConn.getLocalizedValue('Date', '', '')
    },
    {
      renderer: 'description',
      label: pConn.getLocalizedValue('Description', '', '')
    },
    {
      renderer: 'user',
      label: pConn.getLocalizedValue('Performed by', '', '')
    }
  ];

  useEffect(() => {
    const parameters: Parameters = { CaseInstanceKey: caseID };
    const payload: Payload = { dataViewParameters: parameters };

    PCore.getDataApiUtils()
      .getData('D_pyWorkHistory', payload, context)
      .then((response: AxiosResponse) =>
        setHistory(handleResponse(response.data.data, mapHistoryDataItem))
      )
      .catch(() => setHistory([]))
      .finally(() => setIsLoading(false));
  }, [caseID, context]);

  return (
      <Table
        title={pConn.getLocalizedValue(label, '', '')}
        columns={columns}
        data={history}
        loading={isLoading}
        loadingMessage={pConn.getLocalizedValue('Loading case history')}
      />
  );
}

export default withConfiguration(SlDxExtensionsStarRatingWidget);
