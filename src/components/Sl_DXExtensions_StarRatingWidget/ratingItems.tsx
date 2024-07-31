import {
  Action,
  Rating,
  SummaryListItem,
  createUID,
  MetaList,
  Text,
  DateTimeDisplay
} from '@pega/cosmos-react-core';

import createAction, { type ActionWithDataItem } from './actions';
import { RatingDataItem } from './ratingData';

export interface DataItemSummaryListItem<T> extends SummaryListItem {
  dataItem: T;
}

export const mapRatingDataItem = (
  dataItem: RatingDataItem,
  getPConnect: () => typeof PConnect,
  onClickHandler: ActionWithDataItem<RatingDataItem>
): DataItemSummaryListItem<RatingDataItem> => {
  const caseKey = getPConnect().getCaseInfo().getKey();
  const isCurrent = caseKey && dataItem.CaseID === caseKey;

  // eslint-disable-next-line no-console
  console.log(
    `Current case is ${caseKey}, ${dataItem.CaseID} ${
      isCurrent ? 'is' : 'is not'
    } the current case`
  );
  const actions: Action[] = isCurrent
    ? [
        createAction<RatingDataItem>(
          'Edit',
          getPConnect,
          onClickHandler,
          dataItem
        )
      ]
    : [];

  return {
    dataItem,
    id: dataItem.pyGUID ?? createUID(),
    actions,
    primary: (
      <Rating
        key={`${dataItem.pyGUID ?? createUID()}-rating`}
        value={dataItem.CustomerRating}
        metaInfo={`${dataItem.CustomerRating} of ${dataItem.NumberOfStars}`}
      />
    ),
    secondary: (
      <MetaList
        key={`${dataItem.pyGUID ?? createUID()}-metalist`}
        items={[
          <DateTimeDisplay
            value={dataItem.pxUpdateDateTime}
            variant='datetime'
            format='short'
          />,
          <Text>{dataItem.CaseClassName}</Text>,
          <Text>{dataItem.CaseID}</Text>,
          <Text>{dataItem.CustomerID}</Text>
        ]}
      />
    )
  };
};
export default mapRatingDataItem;
