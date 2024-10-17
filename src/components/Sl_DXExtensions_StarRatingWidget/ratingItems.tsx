import {
  Rating as CosmosRating,
  createUID,
  MetaList,
  DateTimeDisplay,
  Link,
  Text
} from '@pega/cosmos-react-core';
import type { Action } from '@pega/cosmos-react-core';
import dayjs from 'dayjs';
import tzone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import type { ReactNode } from 'react';
import createAction from './actionUtils';
import type { ActionWithDataItem } from './actionUtils';
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
  const localizedVal = getPConnect().getLocalizedValue;
  const localeRuleKey = `${dataItem.caseClass}!PAGE!PYDETAILS`;

  const linkURL = PCore.getSemanticUrlUtils().getResolvedSemanticURL(
    PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
    { caseClassName: dataItem.caseClass },
    {
      workID:
        dataItem.caseId.split(' ').length > 1
          ? dataItem.caseId.split(' ')[1]
          : dataItem.caseId
    }
  );
  const environmentInfo = PCore.getEnvironmentInfo();
  const timezone = environmentInfo && environmentInfo.getTimeZone();

  const items: ReactNode[] = [
    <Link
      href={linkURL}
      variant='link'
      previewable
      onPreview={() =>
        getPConnect().getActionsApi().showCasePreview(dataItem.caseId, {
          caseClassName: dataItem.caseClass
        })
      }
    >
      {dataItem.caseId.split(' ')[1]}
    </Link>,
    <DateTimeDisplay
      value={dayjs(dataItem.updateDateTime).tz(timezone).format()}
      variant='datetime'
      format='short'
    />
  ];

  if (isCurrent)
    items.push(
      <Text>{`${localizedVal('Current case', undefined, localeRuleKey)}`}</Text>
    );

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
        metaInfo={`${dataItem.rating} ${localizedVal(
          'of',
          undefined,
          localeRuleKey
        )} ${dataItem.stars}`}
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
