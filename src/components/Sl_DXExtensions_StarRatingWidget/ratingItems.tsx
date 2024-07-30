import {
  // Action,
  Rating,
  SummaryListItem,
  createUID,
  MetaList,
  Text,
  DateTimeDisplay
} from '@pega/cosmos-react-core';

// import createAction from './actions';
import { RatingDataItem } from './ratingData';

export interface RatingSummaryListItem extends SummaryListItem {
  rating: RatingDataItem;
}

export const mapRatingDataItem = (
  entry: RatingDataItem,
  getPConnect: () => typeof PConnect
): RatingSummaryListItem => {
  const caseKey = getPConnect().getCaseInfo().getKey();
  const isCurrent = caseKey && entry.CaseID === caseKey;

  // eslint-disable-next-line no-console
  console.log(
    `Current case is ${caseKey}, ${entry.CaseID} ${
      isCurrent ? 'is' : 'is not'
    } the current case`
  );
  // const actions: Action[] = isCurrent
  //   ? [createAction('Edit', getPConnect)]
  //   : [];

  return {
    rating: entry,
    id: entry.pyGUID ?? createUID(),
    // actions,
    primary: (
      <Rating
        key={`${entry.pyGUID ?? createUID()}-rating`}
        value={entry.CustomerRating}
        metaInfo={`${entry.CustomerRating} of ${entry.NumberOfStars}`}
      />
    ),
    secondary: (
      <MetaList
        key={`${entry.pyGUID ?? createUID()}-metalist`}
        items={[
          <DateTimeDisplay
            value={entry.pxUpdateDateTime}
            variant='datetime'
            format='short'
          />,
          <Text>{entry.CaseClassName}</Text>,
          <Text>{entry.CaseID}</Text>,
          <Text>{entry.CustomerID}</Text>
        ]}
      />
    )
  };
};
export default mapRatingDataItem;
