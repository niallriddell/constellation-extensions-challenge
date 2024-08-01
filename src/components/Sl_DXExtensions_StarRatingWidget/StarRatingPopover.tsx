import { MouseEvent, RefCallback, useState } from 'react';

import {
  withConfiguration,
  Popover,
  Grid,
  Button,
  Text,
  Action
  // useElement
} from '@pega/cosmos-react-core';

import StarRating from '../Sl_DXExtensions_StarRating';
import { Rating } from './ratingData';

// This form popover displays the Sl_DXExtensioms_StartRating component in context
// of the action so as to make it easier to update or add a rating for the current
// case.  All updates to data are done via an callback passed in from the parent.
// Popover target is requried to ensure positioning of the popover is relative to
// the popover target.  Popover width is hard-coded ('40ch') in our example.
const StarRatingPopover = ({
  popoverTarget,
  setPopoverTarget,
  onUpdateRating,
  currentRating,
  action
}: {
  popoverTarget: Element | null;
  setPopoverTarget: RefCallback<Element | null>;
  onUpdateRating: (newRating: Rating) => void;
  currentRating: Rating;
  action?: Action;
}) => {
  const [ratingValue, setRatingValue] = useState<number>(
    (currentRating && currentRating.rating) || 0
  );
  const pyId = currentRating?.caseId.split(' ')[1];

  return (
    <Popover
      as={Grid}
      container={{ inline: true, rowGap: 2, pad: 2 }}
      strategy='fixed'
      target={popoverTarget}
      portal={false}
      arrow
      style={{ width: '40ch' }}
    >
      <Text variant='h2'>{`${action?.text} : ${pyId}`}</Text>
      <StarRating
        min='0'
        max='5'
        onChange={setRatingValue}
        value={ratingValue}
      />

      <Grid
        container={{
          cols: 'repeat(2, 1fr)',
          colGap: 1,
          alignItems: 'end'
        }}
      >
        <Button
          onClick={() => {
            setPopoverTarget(null);
          }}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          variant='primary'
          onClick={(e: MouseEvent) => {
            e.preventDefault();
            onUpdateRating({ ...currentRating, rating: ratingValue });
            setPopoverTarget(null);
          }}
        >
          Submit
        </Button>
      </Grid>
    </Popover>
  );
};
export default withConfiguration(StarRatingPopover);
