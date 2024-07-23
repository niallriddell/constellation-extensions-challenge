import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';

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

import { createRating, getRatings, updateRating, type Rating } from './ratingData';
import { searchByRating, searchByCustomer } from './searchFunctions';
import { createAction } from './actions';
import { createSummaryItem } from './summaryListUtils';
import SummaryListViewAllModal, { type SummaryListViewAllProps } from './SummaryListViewAllModal';
import StarRatingPopover from './StarRatingPopover';

registerIcon(star);

export interface SlDxExtensionsStarRatingsWidgetProps extends PConnFieldProps {
  customerId?: string;
  ratingDataClass: string;
  ratingLookupDatapage: string[];
  ratingListDatapage: string[];
  ratingSavableDatapage: string[];
}
// TODO:
// - Add PubSub for updating utilities panel count
// - [Optional] - Add websocket handler to update utilities panel count on server
//                change
// - Localization of all strings

const SlDxExtensionsStarRatingsWidget = ({
  getPConnect,
  label,
  customerId,
  ratingDataClass,
  ratingLookupDatapage,
  ratingListDatapage,
  ratingSavableDatapage
}: SlDxExtensionsStarRatingsWidgetProps) => {
  const lookup = ratingLookupDatapage[0];
  const list = ratingListDatapage[0];
  const savable = ratingSavableDatapage[0];

  console.log(ratingDataClass, ratingLookupDatapage, ratingListDatapage, ratingSavableDatapage);
  console.log(ratingDataClass, lookup, list, savable);
  // At this stage our widget is a CASE widget only and etherefore we know we're in the
  // current case context during runtime.
  // Utility widgets do not store their data in the case directly so can also
  // be used on Resolved cases.
  const contextName = getPConnect().getContextName();
  const caseKey = getPConnect().getCaseInfo().getKey();
  const caseClass = getPConnect().getCaseInfo().getClassName();

  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Array<Rating>>([]);
  const [actionId, setActionId] = useState<string | undefined>();
  const [selectedRating, setSelectedRating] = useState<Rating>({
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
  const [popoverTarget, setPopoverTarget] = useElement<Element>(null);

  // All non-transient updates to rating data are performed via this function.
  // New rating objects don't yet have a GUID as this is created by Infinity, so we
  // assign a temporary one until we perform a successful create.  Updates use the
  // existing GUID to lookup and update the data object via the savable data page
  // associated with the data class.
  // Persist your data to the server first and update the UI to align.
  const onUpdateRating = (updatedRating: Rating) => {
    updatedRating.guid = updatedRating?.guid || 'NEW';

    const upsert = updatedRating.guid === 'NEW' ? createRating : updateRating;

    upsert(savable, updatedRating).then(rating =>
      rating
        ? setRatings([rating, ...(upsert === createRating ? ratings : ratings.slice(1))])
        : undefined
    );
  };

  // We iterate over the ratings to create the SummaryItems.  Memoization helps to
  // avoid re-running expensive operations.  In our case it saves one execution on rerender.
  // On a small dataset it may not be worth memoizing as there is a tradeoff.
  // We need to capture the selected rating so we know which rating to perform actions on.
  const summaryItems = useMemo(
    () =>
      ratings.map(item => {
        const summaryItem = createSummaryItem(item, getPConnect, caseKey);
        return {
          ...summaryItem,
          actions: summaryItem.actions?.map((action: Action) => ({
            ...action,
            onClick(id: string, e: MouseEvent, menuButton?: HTMLButtonElement) {
              setActionId(id);
              setPopoverTarget(menuButton || e.currentTarget);
              setSelectedRating(summaryItem.rating);
            }
          }))
        };
      }),
    [ratings, getPConnect, caseKey, setActionId, setPopoverTarget, setSelectedRating]
  );

  // An effect is required here because we're synchronising the open modal with changes in the
  // data manged by the parent component.
  // When and when not to use an effect is well documented here: https://react.dev/learn/you-might-not-need-an-effect
  useEffect(() => {
    modalRef.current?.update({ items: summaryItems });
  });

  useEffect(() => {
    // We don't anticipate a large number of ratings per customer, so for now we can
    // use array processing to find the current case rating in the ratings array.
    const processRatings = (allRatings: Array<Rating>) => {
      if (!customerId || !caseKey) {
        return allRatings;
      }

      const caseRatingIndex = allRatings.findIndex(rating => rating.caseId === caseKey);

      if (caseRatingIndex >= 0) {
        return [allRatings.splice(caseRatingIndex, 1)[0], ...allRatings];
      }

      return allRatings;
    };

    const fetchRatings = async () => {
      const allRatings = await getRatings(list, customerId, contextName);
      if (allRatings && allRatings.length > 0) {
        setRatings(processRatings(allRatings));
      }
      setLoading(false);
    };
    fetchRatings();
  }, [list, customerId, contextName, caseKey]);

  // As we always insert the current case rating at the top of the ratings array
  // we check if the first element of the array is for the current case.  If not we
  // display the 'Add' action.
  const summaryActions =
    (customerId && ratings.length && ratings[0].caseId !== caseKey) || ratings.length === 0
      ? [createAction('Add', getPConnect)].map((action: Action) => ({
          ...action,
          onClick(id: string, e: MouseEvent) {
            setActionId(id);
            setPopoverTarget(e.currentTarget);
          }
        }))
      : [];

  const openViewAll = () => {
    // We use a ref here so that we can refresh the modal with any data updates.
    modalRef.current = createModal<SummaryListViewAllProps>(
      SummaryListViewAllModal,
      {
        name: label,
        loading,
        items: summaryItems,
        actions: summaryActions,
        searchFunction: customerId ? searchByRating : searchByCustomer,
        currentRating: selectedRating,
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
        icon='star'
        items={summaryItems.slice(0, 3)}
        loading={loading}
        count={!loading ? ratings.length : undefined}
        headingTag='h3'
        name={label}
        actions={summaryActions}
        onViewAll={openViewAll}
      />
      {popoverTarget && (
        <StarRatingPopover
          popoverTarget={popoverTarget}
          setPopoverTarget={setPopoverTarget}
          currentRating={selectedRating}
          onUpdateRating={onUpdateRating}
          actionId={actionId}
        />
      )}
    </>
  );
};

export default withConfiguration(SlDxExtensionsStarRatingsWidget);
