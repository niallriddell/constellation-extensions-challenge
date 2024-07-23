import { useCallback, useMemo, useState, MouseEvent } from 'react';

import type { Action } from '@pega/cosmos-react-core';
import { Modal, ViewAll, useElement, withConfiguration } from '@pega/cosmos-react-core';

import type { Rating } from './ratingData';
import { SearchFunction } from './searchFunctions';
import { StarRatingSummaryListItem } from './summaryListUtils';
import StarRatingPopover from './StarRatingPopover';

export interface SummaryListViewAllProps {
  name: string;
  loading: boolean;
  items: Array<StarRatingSummaryListItem>;
  actions: Array<Action>;
  searchFunction: SearchFunction<Rating>;
  currentRating: Rating;
  onUpdateRating: (newRating: Rating) => void;
}

// This is the ViewAll modal implementation.  It's primary purpose is to
// display all of the items and also any associated actions.  Mutation logic
// is handled in the parent component.
// The search filter is also implemented here.  We have the ability to use
// different filter functions based on different contexts.  If we were to
// expand this to a PAGE & CASE widget we could filter by customer instead of
// rating.
const SummaryListViewAllModal = ({
  name,
  loading,
  items,
  actions,
  searchFunction,
  currentRating,
  onUpdateRating
}: SummaryListViewAllProps) => {
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState<string | undefined>();
  const [popoverTarget, setPopoverTarget] = useElement(null);
  const [selectedRating, setSelectedRating] = useState<Rating>(currentRating);

  const onClickHandler = useCallback(
    (id: string, e: MouseEvent<HTMLElement>, menuButton?: HTMLElement, rating?: Rating) => {
      setActionId(id);
      setPopoverTarget(menuButton || e.currentTarget);
      if (rating) setSelectedRating(rating);
    },
    [setPopoverTarget]
  );

  const newItems = useMemo(
    () =>
      items.map(item => {
        const { actions: newActions } = item;

        const updatedActions = newActions?.map(action => {
          return {
            ...action,
            onClick: (id: string, e: MouseEvent<HTMLElement>, menuButton?: HTMLElement) =>
              onClickHandler(id, e, menuButton, item?.rating)
          };
        });

        return { ...item, actions: updatedActions };
      }),
    [items, onClickHandler]
  );

  const updatedActions = useMemo(
    () =>
      actions.map((action: Action) => {
        return {
          ...action,
          onClick: onClickHandler
        };
      }),
    [actions, onClickHandler]
  );

  const itemsToRender = useMemo(() => {
    if (search.trim()) {
      return newItems.filter(item => searchFunction(item.rating, search.trim()));
    }
    return newItems;
  }, [newItems, search, searchFunction]);

  return (
    <Modal count={itemsToRender.length} heading={name}>
      <ViewAll
        actions={updatedActions}
        loading={loading}
        items={itemsToRender}
        searchInputProps={{ onSearchChange: setSearch }}
      />
      {popoverTarget && (
        <StarRatingPopover
          popoverTarget={popoverTarget}
          setPopoverTarget={setPopoverTarget}
          actionId={actionId}
          currentRating={selectedRating}
          onUpdateRating={onUpdateRating}
        />
      )}
    </Modal>
  );
};

export default withConfiguration(SummaryListViewAllModal);
