import {
  // Link,
  Text,
  Rating as CosmosRating,
  createUID,
  MetaList,
  DateTimeDisplay,
  Action
} from '@pega/cosmos-react-core';
import dayjs from 'dayjs';
import tzone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ReactNode } from 'react';
import createAction, { type ActionWithDataItem } from './actionUtils';
import type { DataItemSummaryListItem } from './itemUtils';
import { Rating } from './ratingData';

dayjs.extend(tzone);
dayjs.extend(utc);

export const mapRatingDataItem = (
  dataItem: Rating,
  getPConnect: () => typeof PConnect,
  onClickHandler: ActionWithDataItem<Rating> | Action['onClick']
): DataItemSummaryListItem<Rating> => {
  const caseKey = getPConnect().getCaseInfo().getKey();
  const isCurrent = caseKey && dataItem.caseId === caseKey;

  // const linkURL = PCore.getSemanticUrlUtils().getResolvedSemanticURL(
  //   PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
  //   { caseClassName: dataItem.caseClass },
  //   {
  //     workID:
  //       dataItem.caseId.split(' ').length > 1
  //         ? dataItem.caseId.split(' ')[1]
  //         : dataItem.caseId
  //   }
  // );

  const environmentInfo = PCore.getEnvironmentInfo();
  const timezone = environmentInfo?.getTimeZone();

  const items: ReactNode[] = [
    // <Link
    //   href={linkURL}
    //   variant='link'
    //   previewable
    //   onPreview={() =>
    //     getPConnect().getActionsApi().showCasePreview(dataItem.caseId, {
    //       caseClassName: dataItem.caseClass
    //     })
    //   }
    // >
    //   {dataItem.caseId.split(' ')[1]}
    // </Link>,
    <DateTimeDisplay
      value={dayjs(dataItem.updateDateTime).tz(timezone).format()}
      variant='datetime'
      format='short'
    />,
    <Text>{dataItem.caseClass}</Text>,
    <Text>{dataItem.caseId}</Text>
  ];

  const actions: Action[] = isCurrent
    ? [createAction<Rating>('Edit', getPConnect, onClickHandler, dataItem)]
    : [];

  return {
    dataItem,
    id: dataItem.guid ?? createUID(),
    actions,
    primary: (
      <CosmosRating
        key={`${dataItem.guid ?? createUID()}-rating`}
        value={dataItem.rating}
        metaInfo={`${dataItem.rating} of ${dataItem.stars}`}
      />
    ),
    secondary: (
      <MetaList
        key={`${dataItem.guid ?? createUID()}-metalist`}
        items={items}
      />
    )
  };
};
export default mapRatingDataItem;
