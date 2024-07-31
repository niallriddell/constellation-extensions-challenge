import type { ActionWithDataItem } from './actions';

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
