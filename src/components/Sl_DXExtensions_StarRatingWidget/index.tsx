/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';

import {
  Action,
  registerIcon,
  SummaryList,
  Text,
  // useElement,
  withConfiguration
} from '@pega/cosmos-react-core';

import type { Payload } from '@pega/pcore-pconnect-typedefs/data-view/types';
import type { Parameters } from '@pega/pcore-pconnect-typedefs/datapage/types';
import * as star from '@pega/cosmos-react-core/lib/components/Icon/icons/star.icon';

import type { PConnFieldProps } from './PConnProps';

import type { RatingDataItem as DataItem } from './ratingData';
import mapDataItem from './ratingItems';
import type { ActionWithDataItem } from './actionUtils';
import createItems from './itemUtils';
import createAction from './actionUtils';

registerIcon(star);

export interface SlDxExtensionsStarRatingWidgetProps extends PConnFieldProps {
  listDataPage: string;
  customerId: string;
}

function SlDxExtensionsStarRatingWidget(
  props: SlDxExtensionsStarRatingWidgetProps
) {
  const { getPConnect, label, listDataPage, customerId } = props;
  const [data, setData] = useState<DataItem[]>([]);
  const [actionId, setActionId] = useState<string>();
  // const [dataItem, setDataItem] = useState<DataItem | null>();
  // const [actionTarget, setActionTarget] = useElement<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const caseKey = getPConnect().getCaseInfo().getKey();
  const context = getPConnect().getContextName();

  useEffect(() => {
    const parameters: Parameters = { CustomerID: customerId };
    const payload: Payload = { dataViewParameters: parameters };

    PCore.getDataApiUtils()
      .getData(listDataPage, payload, context)
      .then(response => {
        setData((response?.data?.data as DataItem[]) ?? []);
      })
      .catch(() => setData([]))
      .finally(() => setIsLoading(false));
  }, [customerId, context, listDataPage]);

  const onActionItemClick: ActionWithDataItem<DataItem> = (
    actionDataItem,
    id,
    e,
    menuButton
  ) => {
    setActionId(id);
    // setActionTarget(menuButton ?? e.currentTarget);
    // setDataItem(actionDataItem);
  };

  const items = createItems(data, getPConnect, mapDataItem, onActionItemClick);

  const onActionClick: Action['onClick'] = (id, e, menuButton) => {
    setActionId(id);
    // setActionTarget(menuButton ?? e.currentTarget);
    // setDataItem(null);
  };

  const actions =
    data.findIndex(di => di.CaseID === caseKey) < 0
      ? [createAction('Add', getPConnect, onActionClick)]
      : [];

  return (
    <>
      <SummaryList
        key={`summaryList-${customerId}`}
        actions={actions}
        icon='star'
        name={label}
        count={isLoading ? 0 : data?.length}
        loading={isLoading}
        items={items ?? []}
      />
      {
        actionId && (
          <Text
            variant='h1'
            onClick={() => setActionId(undefined)}
          >{`Click me to dismiss: ${actionId}`}</Text>
        )

        // actionTarget && (
        //   <Text
        //     variant='h1'
        //     onClick={() => setActionTarget(null)}
        //   >{`Click me to dismiss: ${actionId}${
        //     dataItem ? `:${dataItem.CaseID}` : ''
        //   }`}</Text>
        // )
      }
    </>
  );
}

export default withConfiguration(SlDxExtensionsStarRatingWidget);
