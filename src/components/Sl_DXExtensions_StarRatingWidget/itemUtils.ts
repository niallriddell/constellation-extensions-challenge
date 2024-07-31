import type { SummaryListItem } from '@pega/cosmos-react-core';
import type { ActionWithDataItem } from './actionUtils';

export interface DataItemSummaryListItem<T> extends SummaryListItem {
  dataItem: T;
}

const createItems = <T, U>(
  data: T[],
  getPConnect: () => typeof PConnect,
  onClickHandler: ActionWithDataItem<T>,
  mapFunction: (
    dataItem: T,
    getPConnect: () => typeof PConnect,
    onClickHandler: ActionWithDataItem<T>,
    index: number
  ) => U
): U[] =>
  data
    ? data.map((dataItem, index) =>
        mapFunction(dataItem, getPConnect, onClickHandler, index)
      )
    : [];

export default createItems;
