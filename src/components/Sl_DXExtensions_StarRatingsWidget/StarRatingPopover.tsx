import { RefCallback, useState } from "react";

import {
  withConfiguration,
  Popover,
  Grid,
  Button,
  Text
} from "@pega/cosmos-react-core";

import StarRating from '../Sl_DXExtensions_StarRating';
import { Rating } from "./ratingData";

const StarRatingPopover = (
  { popoverTarget, setPopoverTarget, onUpdateRating, currentRating, actionId }:
    {
      popoverTarget:
      Element | null,
      setPopoverTarget: RefCallback<Element | null>,
      onUpdateRating: (newRating: Rating) => void,
      currentRating: Rating,
      actionId?: string,
    }) => {

  const [ratingValue, setRatingValue] = useState<number>(currentRating && currentRating.rating || 0);

  return (
    <Popover
      as={Grid}
      container={{ inline: true, rowGap: 2, pad: 2 }}
      strategy='absolute'
      placement='auto'
      target={popoverTarget}
      arrow
      style={{ width: '40ch' }}
    >
      <Text variant="h2">{actionId === 'rating:edit' ? `Edit: ${currentRating?.caseId.split(" ")[1]}` : `Add: ${currentRating?.caseId.split(" ")[1]}`} rating</Text>
      <StarRating min='0' max='5' onChange={setRatingValue} value={ratingValue} />

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
    </Popover >)
}
export default withConfiguration(StarRatingPopover);


