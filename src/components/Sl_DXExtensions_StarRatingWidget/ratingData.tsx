import type { TableProps } from '@pega/cosmos-react-core/lib/components/Table/Table';
import { Rating } from '@pega/cosmos-react-core';

export type RatingDataItem = {
  CaseClassName: string;
  CaseID: string;
  CustomerID: string;
  CustomerRating: number;
  NumberOfStars: number;
  pyGUID?: string;
  pxUpdateDateTime?: string;
};

type RatingItem = {
  caseId: string;
  rating: number | JSX.Element;
  updated: string;
  customerId: string;
};

export type RatingTableRow = TableProps<
  RatingItem & {
    id: number;
  }
>;

export const mapRatingDataItem = (
  entry: RatingDataItem,
  index: number
): RatingItem & { id: number } => ({
  updated: entry.pxUpdateDateTime
    ? new Date(entry.pxUpdateDateTime).toLocaleString()
    : 'No data',
  rating: (
    <Rating
      value={entry.CustomerRating}
      metaInfo={`${entry.CustomerRating} of ${entry.NumberOfStars}`}
    />
  ),
  caseId: entry.CaseID,
  customerId: entry.CustomerID,
  id: index
});

export const createRatingTableSchema = (
  getPConnect: () => typeof PConnect
): RatingTableRow['columns'] => {
  const getLocalizedValue = getPConnect().getLocalizedValue;
  return [
    {
      renderer: 'updated',
      label: getLocalizedValue('Updated', '', '')
    },
    {
      renderer: 'rating',
      label: getLocalizedValue('Customer Rating', '', ''),
      noWrap: true
    },
    {
      renderer: 'caseId',
      label: getLocalizedValue('Case ID', '', '')
    },
    {
      renderer: 'customerId',
      label: getLocalizedValue('Customer ID', '', ''),
      noWrap: true
    }
  ];
};
