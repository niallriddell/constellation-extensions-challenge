import {
  type Action,
  Rating as CosmosRating,
  SummaryListItem,
  Text
} from '@pega/cosmos-react-core';

import { createAction } from './actions';
import type { Rating } from './ratingData';

export interface StarRatingSummaryListItem extends SummaryListItem {
  rating: Rating;
}

export const createSummaryItem = (
  rating: Rating,
  getPConnect: () => typeof PConnect,
  caseKey?: string
): StarRatingSummaryListItem => {

  const isCurrent = caseKey && rating.caseId === caseKey;

  const actions: Action[] =
    isCurrent ?
      [
        createAction('Edit', getPConnect),
        // createAction('Delete', getPConnect)
      ]
      : [];

  return {
    id: rating.guid || 'NEW',
    actions,
    rating,
    primary: (
      <>
        <CosmosRating
          value={rating.rating}
          metaInfo={`${rating.rating} of ${rating.stars}`}
        />
        <Text>{rating.caseId}{isCurrent && ' : this is the current case'}</Text>
      </>
    )
  }
}
