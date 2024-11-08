// import {
//   Rating,
//   createUID,
//   MetaList,
//   Text,
//   DateTimeDisplay
// } from '@pega/cosmos-react-core';
import type { SummaryListItem } from '@pega/cosmos-react-core';
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

// export const mapRatingDataItem = (entry: RatingDataItem): SummaryListItem => ({
//   id: entry.pyGUID ?? createUID(),
//   primary: (
//     <Rating
//       key={`${entry.pyGUID ?? createUID()}-rating`}
//       value={entry.CustomerRating}
//       metaInfo={`${entry.CustomerRating} of ${entry.NumberOfStars}`}
//     />
//   ),
//   secondary: (
//     <MetaList
//       key={`${entry.pyGUID ?? createUID()}-metalist`}
//       items={[
//         <DateTimeDisplay
//           value={entry.pxUpdateDateTime}
//           variant='datetime'
//           format='short'
//         />,
//         <Text>{entry.CaseClassName}</Text>,
//         <Text>{entry.CaseID}</Text>,
//         <Text>{entry.CustomerID}</Text>
//       ]}
//     />
//   )
// });

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
