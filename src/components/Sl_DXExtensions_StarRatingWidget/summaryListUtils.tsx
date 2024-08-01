import {
  type Action,
  Rating as CosmosRating,
  SummaryListItem,
  MetaList,
  Link,
  DateTimeDisplay,
  Text
} from '@pega/cosmos-react-core';
import { ReactNode } from 'react';

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
  const key =
    rating.caseId.split(' ').length > 1
      ? rating.caseId.split(' ')[1]
      : rating.caseId;

  const linkURL = PCore.getSemanticUrlUtils().getResolvedSemanticURL(
    PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
    { caseClassName: rating.caseClass },
    {
      workID: key
    }
  );

  const items: ReactNode[] = [
    <Link
      key={`${key}-link`}
      href={linkURL}
      variant='link'
      previewable
      onPreview={() =>
        getPConnect().getActionsApi().showCasePreview(rating.caseId, {
          caseClassName: rating.caseClass
        })
      }
    >
      {rating.caseId.split(' ')[1]}
    </Link>,
    <DateTimeDisplay
      key={`${key}-datatimedisplay`}
      value={rating.updateDateTime}
      variant='datetime'
      format='short'
    />
  ];

  if (isCurrent)
    items.push(
      <Text variant='h4'>
        {getPConnect().getLocalizedValue('Current case')}
      </Text>
    );

  const secondary = <MetaList wrapItems={false} items={items} />;

  const actions: Action[] = isCurrent
    ? [
        createAction('Edit', getPConnect)
        // createAction('Delete', getPConnect)
      ]
    : [];

  return {
    id: rating.guid ?? 'NEW',
    actions,
    rating,
    primary: (
      <CosmosRating
        value={rating.rating}
        metaInfo={`${rating.rating} ${getPConnect().getLocalizedValue('of')} ${
          rating.stars
        }`}
      />
    ),
    secondary
  };
};
