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

import { getRatings, type Rating } from './ratingData';
import { searchByRating, searchByCustomer } from './searchFunctions';
import { createAction } from './actions';
import { createSummaryItem } from './summaryListUtils';
import SummaryListViewAllModal,
{ type SummaryListViewAllProps } from './SummaryListViewAllModal';
import StarRatingPopover from './StarRatingPopover';

registerIcon(star);

// interface for props
export interface SlDxExtensionsStarRatingsWidgetProps extends PConnFieldProps {
  customerId?: string;
  listDataView: string;
}
// TODO: 
// - Add create and update data object logic
// - Wire up create and update data object logic to update handler
// - Improve formatting of text below rating 
// - Update config.json to allow selection of data class and associated data pages
// - Wire in new props to line up with config.json
// - Add PubSub for updating utilities panel count
// - [Optional] - Add websocket handler to update utilities panel count on server
//                change
// - 
const SlDxExtensionsStarRatingsWidget = ({
  getPConnect,
  label,
  customerId,
  listDataView
}: SlDxExtensionsStarRatingsWidgetProps) => {
  const contextName = getPConnect().getContextName();
  const caseKey = getPConnect().getCaseInfo().getKey();
  const caseClass = getPConnect().getCaseInfo().getClassName();

  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Array<Rating>>([]);
  const [actionId, setActionId] = useState<string | undefined>();
  const [selectedRating, setSelectedRating] = useState<Rating>(
    {
      rating: 0,
      customerId: customerId || 'No Customer',
      stars: 5,
      caseClass,
      caseId: caseKey
    }
  );
  const modalRef = useRef<ModalMethods<SummaryListViewAllProps>>();

  const { create: createModal } = useModalManager();
  const [popoverTarget, setPopoverTarget] = useElement<HTMLDivElement>(null);

  const onUpdateRating = (newRating: Rating) => {
    // In memory only for now.
    if (!newRating?.guid) {
      newRating.guid = 'NEW';
      setRatings([newRating, ...ratings]);
      return;
    }
    setRatings([newRating, ...ratings.slice(1)]);
  }

  const summaryItems = useMemo(() =>
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
    }), [ratings, getPConnect, caseKey, setActionId, setPopoverTarget, setSelectedRating]);

  useEffect(() => {
    modalRef.current?.update({ items: summaryItems })
  });

  useEffect(() => {
    const processRatings = (allRatings: Array<Rating>) => {
      if (!customerId || !caseKey) {
        return allRatings;
      }

      const caseRatingIndex = allRatings
        .findIndex(rating => rating.caseId === caseKey);

      if (caseRatingIndex >= 0) {
        return [allRatings.splice(caseRatingIndex, 1)[0], ...allRatings];
      }

      return allRatings;
    }

    const fetchRatings = async () => {
      const allRatings = await getRatings(listDataView, customerId, contextName);
      if (allRatings && allRatings.length > 0) {
        setRatings(processRatings(allRatings));
      }
      setLoading(false);
    }
    fetchRatings();
  }, [listDataView, customerId, contextName, caseKey]);

  const summaryActions =
    customerId && ratings.length && ratings[0].caseId !== caseKey
      || ratings.length === 0
      ? [createAction('Add', getPConnect)].map((action: Action) => ({
        ...action,
        onClick(id: string, e: MouseEvent) {
          setActionId(id);
          setPopoverTarget(e.currentTarget);
        }
      })) : []

  const openViewAll = () => {
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
          modalRef.current = undefined;
        }
      }
    );
  }

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
      {popoverTarget &&
        <StarRatingPopover
          popoverTarget={popoverTarget}
          setPopoverTarget={setPopoverTarget}
          currentRating={selectedRating}
          onUpdateRating={onUpdateRating}
          actionId={actionId}
        />
      }
    </>
  );
}

export default withConfiguration(SlDxExtensionsStarRatingsWidget);


