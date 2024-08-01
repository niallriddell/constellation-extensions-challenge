import { useEffect, useRef, useState } from 'react';

import type { Action, ModalMethods } from '@pega/cosmos-react-core';
import {
  SummaryList,
  withConfiguration,
  useModalManager,
  useElement,
  registerIcon
} from '@pega/cosmos-react-core';

import * as star from '@pega/cosmos-react-core/lib/components/Icon/icons/star.icon';

import type { PConnFieldProps } from './PConnProps';

import {
  createRating,
  getRatings,
  updateRating,
  type Rating as DataItem
} from './ratingData';

import { searchByRating, searchByCustomer } from './searchFunctions';
import mapDataItem from './ratingItems';
import type { ActionWithDataItem } from './actionUtils';
import createItems from './itemUtils';
import createAction from './actionUtils';
import SummaryListViewAllModal, {
  type SummaryListViewAllProps
} from './SummaryListViewAllModal';
import StarRatingPopover from './StarRatingPopover';

registerIcon(star);

// TODO: Add any additional properties here that are configured in the config.json
export interface SlDxExtensionsStarRatingWidgetProps extends PConnFieldProps {
  customerId?: string;
  ratingDataClass: string;
  ratingLookupDatapage: string[];
  ratingListDatapage: string[];
  ratingSavableDatapage: string[];
}
// TODO:
// - [Optional] - Add websocket handler to update utilities panel count on server
//                change

// TODO: Add any additional properties here that are configured in the config.json
const SlDxExtensionsStarRatingWidget = ({
  getPConnect,
  label,
  customerId,
  ratingDataClass,
  ratingLookupDatapage,
  ratingListDatapage,
  ratingSavableDatapage
}: SlDxExtensionsStarRatingWidgetProps) => {
  const lookup = ratingLookupDatapage[0];
  const list = ratingListDatapage[0];
  const savable = ratingSavableDatapage[0];

  // eslint-disable-next-line no-console
  console.log(
    ratingDataClass,
    ratingLookupDatapage,
    ratingListDatapage,
    ratingSavableDatapage
  );
  // eslint-disable-next-line no-console
  console.log(ratingDataClass, lookup, list, savable);
  // At this stage our widget is a CASE widget only and etherefore we know we're in the
  // current case context during runtime.
  // Utility widgets do not store their data in the case directly so can also
  // be used on Resolved cases.
  const contextName = getPConnect().getContextName();
  const caseKey = getPConnect().getCaseInfo().getKey();
  const caseClass = getPConnect().getCaseInfo().getClassName();

  const [isLoading, setIsLoading] = useState(true);
  const [IsError, setIsError] = useState(false);
  const [actionTarget, setActionTarget] = useElement<HTMLElement>(null);
  const [data, setData] = useState<Array<DataItem>>([]);
  const [actionId, setActionId] = useState<string | undefined>();
  const [dataItem, setDataItem] = useState<DataItem>({
    rating: 0,
    customerId: customerId || 'No Customer',
    stars: 5,
    caseClass,
    caseId: caseKey
  });
  const modalRef = useRef<ModalMethods<SummaryListViewAllProps>>();

  // Constellation design system hooks for creating modal dialogs
  // and Popover positioning support
  const { create: createModal } = useModalManager();

  // All non-transient updates to rating data are performed via this function.
  // New rating objects don't yet have a GUID as this is created by Infinity, so we
  // assign a temporary one until we perform a successful create.  Updates use the
  // existing GUID to lookup and update the data object via the savable data page
  // associated with the data class.
  // Persist your data to the server first and update the UI to align.
  const onUpdateRating = (updatedRating: DataItem) => {
    updatedRating.guid = updatedRating?.guid || 'NEW';

    const upsert = updatedRating.guid === 'NEW' ? createRating : updateRating;

    upsert(savable, updatedRating).then(rating =>
      rating
        ? setData([rating, ...(upsert === createRating ? data : data.slice(1))])
        : undefined
    );
  };

  const onActionItemClick: ActionWithDataItem<DataItem> = (
    actionDataItem,
    id,
    e,
    menuButton
  ) => {
    setActionId(id);
    setActionTarget(menuButton ?? e.currentTarget);
    if (actionDataItem) setDataItem(actionDataItem);
  };

  // We iterate over the ratings to create the SummaryItems.  Memoization helps to
  // avoid re-running expensive operations.  In our case it saves one execution on rerender.
  // On a small dataset it may not be worth memoizing as there is a tradeoff.
  // We need to capture the selected rating so we know which rating to perform actions on.

  const items = createItems(data, getPConnect, mapDataItem, onActionItemClick);

  // An effect is required here because we're synchronising the open modal with changes in the
  // data manged by the parent component.
  // When and when not to use an effect is well documented here: https://react.dev/learn/you-might-not-need-an-effect
  useEffect(() => {
    modalRef.current?.update({
      items: createItems(data, getPConnect, mapDataItem, onActionItemClick)
    });
  });

  useEffect(() => {
    // We don't anticipate a large number of ratings per customer, so for now we can
    // use array processing to find the current case rating in the ratings array.
    const processRatings = (allRatings: Array<DataItem>) => {
      if (!customerId || !caseKey) {
        return allRatings;
      }

      const caseRatingIndex = allRatings.findIndex(
        rating => rating.caseId === caseKey
      );

      if (caseRatingIndex >= 0) {
        return [allRatings.splice(caseRatingIndex, 1)[0], ...allRatings];
      }

      return allRatings;
    };

    const fetchRatings = async () => {
      try {
        setIsError(false);
        const allRatings = await getRatings(list, customerId, contextName);

        if (allRatings && allRatings.length > 0) {
          setData(processRatings(allRatings));
        }
      } catch (error) {
        setIsError(true);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, [list, customerId, contextName, caseKey]);

  const onActionClick: Action['onClick'] = (id, e, menuButton) => {
    setActionId(id);
    setActionTarget(menuButton ?? e.currentTarget);
  };

  const isEmptyData = !data || data.length === 0;
  const isCaseKeyAbsent =
    data.filter(item => item.caseId === caseKey).length === 0;

  // As we always insert the current case rating at the top of the ratings array
  // we check if the first element of the array is for the current case.  If not we
  // display the 'Add' action.
  const actions =
    isEmptyData || isCaseKeyAbsent
      ? [createAction('Add', getPConnect, onActionClick)]
      : [];

  const openViewAll = () => {
    // We use a ref here so that we can refresh the modal with any data updates.
    modalRef.current = createModal<SummaryListViewAllProps>(
      SummaryListViewAllModal,
      {
        name: label,
        loading: isLoading,
        items,
        actions,
        searchFunction: customerId ? searchByRating : searchByCustomer,
        currentRating: dataItem,
        onUpdateRating
      },
      {
        onDismiss: () => {
          modalRef.current = undefined; // tidy up if modal is dismissed.
        }
      }
    );
  };

  return (
    <>
      <SummaryList
        error={IsError}
        icon='star'
        items={items.slice(0, 3)}
        loading={isLoading}
        count={!isLoading ? items.length : undefined}
        headingTag='h3'
        name={label}
        actions={actions}
        onViewAll={openViewAll}
      />
      {actionTarget && (
        <StarRatingPopover
          popoverTarget={actionTarget}
          setPopoverTarget={setActionTarget}
          currentRating={dataItem}
          onUpdateRating={onUpdateRating}
          actionId={actionId}
        />
      )}
    </>
  );
};

export default withConfiguration(SlDxExtensionsStarRatingWidget);
