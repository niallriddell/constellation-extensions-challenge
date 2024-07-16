import {
  type Action,
  Rating as CosmosRating,
  SummaryListItem,
  Text,
  MetaList,
  Link,
  DateTimeDisplay
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
  const linkURL = PCore.getSemanticUrlUtils().getResolvedSemanticURL(
    PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
    { caseClassName: rating.caseClass },
    {
      workID: rating.caseId.split(' ').length > 1
        ? rating.caseId.split(' ')[1] : rating.caseId
    }
  );

  const secondary = (
    <MetaList
      wrapItems={false}
      items={[
        <Link href={linkURL} variant='link' previewable onPreview={() =>
          getPConnect()
            .getActionsApi()
            .showCasePreview(rating.caseId, {
              caseClassName: rating.caseClass
            })
        }>{rating.caseId.split(' ')[1]}</Link>,
        <DateTimeDisplay value={rating.updateDateTime} variant='datetime' format='short' />,
      ]
      }
    />
  )

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
      <CosmosRating
        value={rating.rating}
        metaInfo={`${rating.rating} of ${rating.stars}`}
      />
    ),
    secondary
  }
}
