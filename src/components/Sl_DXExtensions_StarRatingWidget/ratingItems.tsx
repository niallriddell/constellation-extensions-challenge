import {
  Rating,
  createUID,
  MetaList,
  Text,
  DateTimeDisplay,
  Action
} from '@pega/cosmos-react-core';
import dayjs from 'dayjs';
import tzone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import createAction, { type ActionWithDataItem } from './actionUtils';
import type { DataItemSummaryListItem } from './itemUtils';
import { RatingDataItem } from './ratingData';

dayjs.extend(tzone);
dayjs.extend(utc);

export const mapRatingDataItem = (
  dataItem: RatingDataItem,
  getPConnect: () => typeof PConnect,
  onClickHandler: ActionWithDataItem<RatingDataItem> | Action['onClick']
): DataItemSummaryListItem<RatingDataItem> => {
  const caseKey = getPConnect().getCaseInfo().getKey();
  const isCurrent = caseKey && dataItem.CaseID === caseKey;

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

  const timezone = PCore.getEnvironmentInfo().getTimeZone();

  return {
    dataItem,
    id: dataItem.pyGUID ?? createUID(),
    actions,
    primary: (
      <Rating
        key={`rating-${dataItem.pyGUID ?? createUID()}`}
        value={dataItem.CustomerRating}
        metaInfo={`${dataItem.CustomerRating} of ${dataItem.NumberOfStars}`}
      />
    ),
    secondary: (
      <MetaList
        key={`metalist-${dataItem.pyGUID ?? createUID()}`}
        items={[
          <DateTimeDisplay
            key={`datatimedisplay-${dataItem.pyGUID ?? createUID()}`}
            value={dayjs(dataItem.pxUpdateDateTime).tz(timezone).format()}
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
