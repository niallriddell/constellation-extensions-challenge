import type { ReactElement } from 'react';

import type { TableProps } from '@pega/cosmos-react-core/lib/components/Table/Table';
import { Text } from '@pega/cosmos-react-core';

export type HistoryDataItem = {
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

type HistoryItem = {
  date: string;
  description: ReactElement;
  user: string;
  id: number;
};

export type HistoryTableRow = TableProps<HistoryItem>;

export const mapHistoryDataItem = (
  entry: HistoryDataItem,
  index: number
): HistoryItem => ({
  date: new Date(entry.pxTimeCreated).toLocaleString(),
  description: (
    <Text style={{ wordBreak: 'break-word' }}>{entry.pyMessageKey}</Text>
  ),
  user: entry.pyPerformer,
  id: index
});

export const createHistoryTableSchema = (
  getPConnect: () => typeof PConnect
): HistoryTableRow['columns'] => {
  const getLocalizedValue = getPConnect().getLocalizedValue;
  return [
    {
      renderer: 'date',
      label: getLocalizedValue('Date', '', '')
    },
    {
      renderer: 'description',
      label: getLocalizedValue('Description', '', '')
    },
    {
      renderer: 'user',
      label: getLocalizedValue('Performed by', '', '')
    }
  ];
};
