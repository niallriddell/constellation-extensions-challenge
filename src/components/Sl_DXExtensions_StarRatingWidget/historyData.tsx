import type { TableProps } from '@pega/cosmos-react-core/lib/components/Table/Table';
import { Text } from '@pega/cosmos-react-core';
import { ReactNode } from 'react';

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
  description: ReactNode;
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
  return [
    {
      renderer: 'date',
      label: getPConnect().getLocalizedValue('Date', '', '')
    },
    {
      renderer: 'description',
      label: getPConnect().getLocalizedValue('Description', '', '')
    },
    {
      renderer: 'user',
      label: getPConnect().getLocalizedValue('Performed by', '', '')
    }
  ];
};
