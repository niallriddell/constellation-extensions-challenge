import { useState, useEffect } from 'react';
import { Table, Text, withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';

import StyledSlDxExtensionsStarRatingsWidgetWrapper from './styles';
import type { Payload } from '@pega/pcore-pconnect-typedefs/data-view/types';
import type { Parameters } from '@pega/pcore-pconnect-typedefs/datapage/types';
import type {
  DefaultRowData,
  TableProps
} from '@pega/cosmos-react-core/lib/components/Table/Table';

interface CustomRowData extends DefaultRowData {
  date: string;
  description: string | JSX.Element;
  user: string;
}
// interface for props
export interface SlDxExtensionsStarRatingsWidgetProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
}

function SlDxExtensionsStarRatingsWidget(props: SlDxExtensionsStarRatingsWidgetProps) {
  const { getPConnect, label } = props;
  const pConn = getPConnect();
  const [history, setHistory] = useState<TableProps<CustomRowData>['data']>();
  const [isLoading, setIsLoading] = useState(true);
  const caseProp: string = PCore.getConstants().CASE_INFO.CASE_INFO_ID;
  const caseID: string = pConn.getValue(caseProp, '');
  const context = pConn.getContextName();

  const columns: TableProps<CustomRowData>['columns'] = [
    { renderer: 'date', label: pConn.getLocalizedValue('Date', '', '') },
    { renderer: 'description', label: pConn.getLocalizedValue('Description', '', '') },
    { renderer: 'user', label: pConn.getLocalizedValue('Performed by', '', '') }
  ];

  useEffect(() => {
    const parameters: Parameters = { CaseInstanceKey: caseID };
    const payload: Payload = { dataViewParameters: parameters };

    PCore.getDataApiUtils()
      .getData('D_pyWorkHistory', payload, context)
      .then(response => {
        setIsLoading(false);
        setHistory(
          response.data.data
            ? response.data.data.map((entry, index: number) => ({
                date: new Date(entry.pxTimeCreated).toLocaleString(),
                description: <Text style={{ wordBreak: 'break-word' }}>{entry.pyMessageKey}</Text>,
                user: entry.pyPerformer,
                id: index
              }))
            : []
        );
      })
      .catch(() => {
        setHistory([]);
        setIsLoading(false);
      });
  }, [caseID, context]);

  return (
    <StyledSlDxExtensionsStarRatingsWidgetWrapper>
      <Table
        title={pConn.getLocalizedValue(label, '', '')}
        columns={columns}
        data={history}
        loading={isLoading}
        loadingMessage={pConn.getLocalizedValue('Loading case history', '', '')}
      />
    </StyledSlDxExtensionsStarRatingsWidgetWrapper>
  );
}

export default withConfiguration(SlDxExtensionsStarRatingsWidget);
