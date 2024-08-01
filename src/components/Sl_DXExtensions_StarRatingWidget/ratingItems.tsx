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

  const environmentInfo = PCore.getEnvironmentInfo();
  const timezone = environmentInfo && environmentInfo.getTimeZone();

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
