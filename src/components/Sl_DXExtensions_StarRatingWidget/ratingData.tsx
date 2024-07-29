import { Rating, SummaryListItem } from '@pega/cosmos-react-core';

export type RatingDataItem = {
  CaseClassName: string;
  CaseID: string;
  CustomerID: string;
  CustomerRating: number;
  NumberOfStars: number;
  pyGUID?: string;
  pxUpdateDateTime?: string;
};

export const mapRatingDataItem = (
  entry: RatingDataItem,
  index: number
): SummaryListItem => ({
  primary: (
    <Rating
      value={entry.CustomerRating}
      metaInfo={`${entry.CustomerRating} of ${entry.NumberOfStars}`}
    />
  ),
  id: `ratingDataItem-${index}`
});
