import dayjs from 'dayjs';
import tzone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import {
  Rating as CosmosRating,
  createUID,
  MetaList,
  Text,
  DateTimeDisplay
} from '@pega/cosmos-react-core';
import type { Action } from '@pega/cosmos-react-core';

import createAction, { type ActionWithDataItem } from './actionUtils';
import type { DataItemSummaryListItem } from './itemUtils';
import type { Rating } from './ratingData';

dayjs.extend(tzone);
dayjs.extend(utc);

export const mapRatingDataItem = (
  dataItem: Rating,
  getPConnect: () => typeof PConnect,
  onClickHandler: ActionWithDataItem<Rating> | Action['onClick']
): DataItemSummaryListItem<Rating> => {
  const caseKey = getPConnect().getCaseInfo().getKey();
  const isCurrent = caseKey && dataItem.caseId === caseKey;

  const actions: Action[] = isCurrent
    ? [createAction<Rating>('Edit', getPConnect, onClickHandler, dataItem)]
    : [];

  const environmentInfo = PCore.getEnvironmentInfo();
  const timezone = environmentInfo?.getTimeZone();

  return {
    dataItem,
    id: dataItem.guid ?? createUID(),
    actions,
    primary: (
      <CosmosRating
        key={`rating-${dataItem.guid ?? createUID()}`}
        value={dataItem.rating}
        metaInfo={`${dataItem.rating} of ${dataItem.stars}`}
      />
    ),
    secondary: (
      <MetaList
        key={`metalist-${dataItem.guid ?? createUID()}`}
        items={[
          <DateTimeDisplay
            key={`datetimedisplay-${dataItem.guid ?? createUID()}`}
            value={dayjs(dataItem.updateDateTime).tz(timezone).format()}
            variant='datetime'
            format='short'
          />,
          <Text>{dataItem.caseClass}</Text>,
          <Text>{dataItem.caseId}</Text>
        ]}
      />
    )
  };
};
export default mapRatingDataItem;
