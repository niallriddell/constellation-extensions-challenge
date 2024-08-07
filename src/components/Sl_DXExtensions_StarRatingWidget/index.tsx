import { useState, useEffect, ReactNode } from 'react';

import { Table, Text, withConfiguration } from '@pega/cosmos-react-core';
import type { TableProps } from '@pega/cosmos-react-core/lib/components/Table/Table';

import type { Payload } from '@pega/pcore-pconnect-typedefs/data-view/types';

import type { PConnFieldProps } from './PConnProps';

import StyledSlDxExtensionsStarRatingWidgetWrapper from './styles';

// interface for props
interface SlDxExtensionsStarRatingWidgetProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
}

type HistoryTableProps = TableProps<{
  id: number;
  date: string;
  description: ReactNode;
  user: string;
}>;

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function SlDxExtensionsStarRatingWidget(
  props: SlDxExtensionsStarRatingWidgetProps
) {
  const { getPConnect, label } = props;
  const pConn = getPConnect();
  const [history, setHistory] = useState<HistoryTableProps['data']>();
  const [isLoading, setIsLoading] = useState(true);
  const caseProp: string = PCore.getConstants().CASE_INFO.CASE_INFO_ID;
  const caseID: string = pConn.getValue(caseProp, '');
  const context = pConn.getContextName();

  const columns: HistoryTableProps['columns'] = [
    { renderer: 'date', label: pConn.getLocalizedValue('Date', '', '') },
    {
      renderer: 'description',
      label: pConn.getLocalizedValue('Description', '', '')
    },
    { renderer: 'user', label: pConn.getLocalizedValue('Performed by', '', '') }
  ];

  useEffect(() => {
    const payload: Payload = {
      dataViewParameters: { CaseInstanceKey: caseID }
    };
    PCore.getDataApiUtils()
      .getData('D_pyWorkHistory', payload, context)
      .then(response => {
        setIsLoading(false);
        if (response.data.data !== null) {
          setHistory(
            response.data.data.map((entry, index) => {
              return {
                date: new Date(entry.pxTimeCreated).toLocaleString(),
                description: (
                  <Text style={{ wordBreak: 'break-word' }}>
                    {entry.pyMessageKey}
                  </Text>
                ),
                user: entry.pyPerformer,
                id: index
              };
            })
          );
        } else {
          setHistory([]);
        }
      })
      .catch(() => {
        setHistory([]);
        setIsLoading(false);
      });
  }, [caseID, context]);
  return (
    <StyledSlDxExtensionsStarRatingWidgetWrapper>
      <Table
        title={pConn.getLocalizedValue(label, '', '')}
        columns={columns}
        data={history}
        loading={isLoading}
        loadingMessage={pConn.getLocalizedValue('Loading case history', '', '')}
      />
    </StyledSlDxExtensionsStarRatingWidgetWrapper>
  );
}

export default withConfiguration(SlDxExtensionsStarRatingWidget);
