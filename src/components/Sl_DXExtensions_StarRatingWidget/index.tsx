/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, MouseEvent } from 'react';

import {
  SummaryList,
  withConfiguration,
  registerIcon,
  Action,
  Popover,
  useElement,
  Button,
  Grid,
  Slider,
  Text
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

// interface for props
export interface SlDxExtensionsStarRatingWidgetProps extends PConnFieldProps {
  listDataPage: string;
  customerId: string;
  // If any, enter additional props that only exist on TextInput here
}

function SlDxExtensionsStarRatingWidget(
  props: SlDxExtensionsStarRatingWidgetProps
) {
  const { getPConnect, label, listDataPage, customerId } = props;
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopover, setShowPopover] = useState(true);
  const [actionTarget, setActionTarget] = useElement<HTMLElement>(null);
  const [value, setValue] = useState<number>(0);
  const [actionId, setActionId] = useState<string>();

  const popOverRef = useElement<HTMLDivElement>()[1];

  const caseKey = getPConnect().getCaseInfo().getKey();

  const caseId = getPConnect().getCaseInfo().getID();
  const caseClass = getPConnect().getCaseInfo().getClassName();
  const context = getPConnect().getContextName();
  const [dataItem, setDataItem] = useState<DataItem>({
    CustomerRating: 0,
    NumberOfStars: 5,
    CustomerID: customerId,
    CaseID: caseKey,
    CaseClassName: caseClass
  });

  useEffect(() => {
    const parameters: Parameters = { CustomerID: customerId };
    const payload: Payload = { dataViewParameters: parameters };

    PCore.getDataApiUtils()
      .getData(listDataPage, payload, context)
      .then(response => {
        setData((response?.data?.data as DataItem[]) ?? []);
      })
      .catch(() => {
        setData([]);
      })
      .finally(() => setIsLoading(false));
  }, [customerId, getPConnect, context, listDataPage]);

  const toggleClickPopover = ({ type, key }: { type: string; key: string }) => {
    if (type === 'keydown') {
      if (key === 'Escape') setShowPopover(false);
      return;
    }
    if (type === 'click' || type === 'focus') setShowPopover(true);
  };

  const clickMountingHandlers = {
    onClick: toggleClickPopover,
    onKeyDown: toggleClickPopover,
    onFocus: toggleClickPopover,
    onBlur: toggleClickPopover
  };

  const onActionItemClick: ActionWithDataItem<DataItem> = (
    actionDataItem,
    id,
    e,
    menuButton
  ) => {
    setActionId(id);
    setShowPopover(true);
    setActionTarget(menuButton ?? e.currentTarget);
    // setValue(actionDataItem?.CustomerRating ?? 0);
    if (actionDataItem) setDataItem(actionDataItem);
  };

  const items = createItems(data, getPConnect, mapDataItem, onActionItemClick);

  const isEmptyData = !data || data.length === 0;
  const isCaseKeyAbsent =
    data.filter(item => item.CaseID === caseKey).length === 0;

  const onActionClick: Action['onClick'] = (id, e, menuButton) => {
    setActionId(id);
    setShowPopover(true);
    setActionTarget(menuButton ?? e.currentTarget);
  };
  const actions =
    isEmptyData || isCaseKeyAbsent
      ? [createAction('Add', getPConnect, onActionClick)]
      : [];

  // // TODO: Only in memory and not persisted for now so that Storybook story
  // // works
  // const upsertDataItem = (selectedDataItem: DataItem, changedValue: number) => {
  //   if (selectedDataItem.pyGUID) {
  //     setData(
  //       data.map(dataItemToCheck =>
  //         dataItemToCheck.pyGUID === selectedDataItem.pyGUID
  //           ? {
  //               ...dataItemToCheck,
  //               CustomerRating: changedValue,
  //               pxUpdateDateTime: new Date().toISOString()
  //             }
  //           : dataItemToCheck
  //       )
  //     );
  //     return;
  //   }
  //
  //   const newDataItem = {
  //     ...selectedDataItem,
  //     CustomerRating: changedValue,
  //     pyGUID: 'NEW',
  //     pxUpdateDateTime: new Date().toISOString()
  //   };
  //
  //   setData([...data, newDataItem]);
  // };

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
        onBlur={() => setShowPopover(false)}
        onClick={(e: MouseEvent) => {
          if (actionTarget && e.target !== actionTarget) {
            setShowPopover(false);
          }
        }}
      />
      {actionTarget && (
        <Popover
          as={Grid}
          container={{ inline: true, rowGap: 1, pad: 1 }}
          ref={popOverRef}
          strategy='absolute'
          placement='auto'
          target={actionTarget}
          portal={false}
          arrow
          style={{ width: '25ch' }}
          show={showPopover}
          {...clickMountingHandlers}
        >
          <Text variant='h2'>
            {actionId === 'rating:addNew' ? 'New' : `Edit Rating: ${caseId}`}
          </Text>
          <Slider
            min={0}
            max={5}
            value={value}
            onChange={
              () => {}
              // (changeValue: number) => setValue(changeValue)
            }
          />
          <Grid
            container={{
              cols: 'repeat(2, 1fr)',
              colGap: 1,
              alignItems: 'end',
              pad: 1
            }}
          >
            <Button
              onClick={() => {
                setActionTarget(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='primary'
              onClick={(e: MouseEvent) => {
                e.preventDefault();
                // if (dataItem) upsertDataItem(dataItem, value);
                setActionTarget(null);
              }}
            >
              Submit
            </Button>
          </Grid>
        </Popover>
      )}
    </>
  );
}

export default withConfiguration(SlDxExtensionsStarRatingWidget);
