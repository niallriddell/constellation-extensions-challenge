import type { Action, SummaryListItem } from '@pega/cosmos-react-core';
import type { ActionWithDataItem } from './actionUtils';

export interface DataItemSummaryListItem<T> extends SummaryListItem {
  dataItem: T;
}

const createItems = <T, U>(
  data: T[],
  getPConnect: () => typeof PConnect,
  onClickHandler: ActionWithDataItem<T> | Action["onClick"],
  mapFunction: (
    dataItem: T,
    getPConnect: () => typeof PConnect,
    onClickHandler: ActionWithDataItem<T> | Action["onClick"],
    index: number
  ) => U
): U[] =>
  data
    ? data.map((dataItem, index) =>
        mapFunction(dataItem, getPConnect, onClickHandler, index)
      )
    : [];

export default createItems;
