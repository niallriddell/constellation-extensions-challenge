import type {
  TableProps,
  DefaultRowData
} from '@pega/cosmos-react-core/lib/components/Table/Table';
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

export interface RatingTableRow extends DefaultRowData {
  caseId: string;
  rating: number | JSX.Element;
  updated: string;
  customerId: string;
}

export const mapRatingDataItem = (
  entry: RatingDataItem,
  index: number
): RatingTableRow => ({
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
): TableProps<RatingTableRow>['columns'] => {
  return [
    {
      renderer: 'updated',
      label: getPConnect().getLocalizedValue('Updated', '', '')
    },
    {
      renderer: 'rating',
      label: getPConnect().getLocalizedValue('Customer Rating', '', ''),
      noWrap: true
    },
    {
      renderer: 'caseId',
      label: getPConnect().getLocalizedValue('Case ID', '', '')
    },
    {
      renderer: 'customerId',
      label: getPConnect().getLocalizedValue('Customer ID', '', ''),
      noWrap: true
    }
  ];
};
