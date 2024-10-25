import { useCallback, useEffect, useState, forwardRef } from 'react';

import type {
  KeyboardEvent,
  FunctionComponent,
  PropsWithoutRef,
  Ref,
  TouchEvent,
  MouseEvent
} from 'react';

import {
  Flex,
  Icon,
  registerIcon,
  withConfiguration,
  useUID,
  useConsolidatedRef,
  useDirection,
  cap
} from '@pega/cosmos-react-core';
import type { ForwardProps } from '@pega/cosmos-react-core';
import * as star from '@pega/cosmos-react-core/lib/components/Icon/icons/star.icon';
import * as starSolid from '@pega/cosmos-react-core/lib/components/Icon/icons/star-solid.icon';

import type { StarRatingProps } from './StarRating.types';
import type { PConnProps } from '../../utils/PConnProps';
import './create-nonce';

import { StyledStarWrapper, StyledStarRatingMetaInfo } from './styles';

registerIcon(star, starSolid);

interface SlDXExtensionsStarRatingProps extends StarRatingProps, PConnProps {
  //
}

// When this is referenced as a Field Integer extension component we need to handle the
// updates using getPConnect.  When statically imported we use the change handling of the
// calling component to manage state
const handleChange = (
  newValue: number,
  getPConnect?: () => typeof PConnect
) => {
  const propName: string = getPConnect && getPConnect().getStateProps()?.value;

  if (!propName || !getPConnect) return;

  getPConnect().getActionsApi().updateFieldValue(propName, newValue);
  getPConnect().getActionsApi().triggerFieldChange(propName, newValue);
};

const SlDXExtensionsStarRating: FunctionComponent<
  SlDXExtensionsStarRatingProps & ForwardProps
> = forwardRef(function StarRating(
  props: PropsWithoutRef<SlDXExtensionsStarRatingProps>,
  ref: Ref<HTMLDivElement>
) {
  const uid = useUID();
  const {
    testId,
    id = uid,
    required,
    label,
    min = 0,
    max = 100,
    value = 0,
    disabled = false,
    readOnly = false,
    onChange = handleChange,
    metaInfo = `${value} of ${max}`,
    autoFocus,
    getPConnect = undefined
  } = props;

  const starRatingRef = useConsolidatedRef<HTMLDivElement>(ref);

  const [inHover, setInHovering] = useState(false);
  const [currentHoverValue, setCurrentHoverValue] = useState<number>(value);
  const [currentValue, setCurrentValue] = useState<number>(value);
  const [metaInfoUpdated, setMetaInfoUpdated] = useState(metaInfo);

  const setValue = useCallback(
    (newValue: number, ignoreChange?: boolean) => {
      if (disabled || readOnly) return;
      const normalizedValue = Math.min(Math.max(newValue, min), max);

      setCurrentHoverValue(normalizedValue);
      setCurrentValue(normalizedValue);
      setMetaInfoUpdated(`${normalizedValue} of ${max}`);
      if (!ignoreChange) onChange(normalizedValue, getPConnect);
      starRatingRef?.current?.focus();
    },
    [starRatingRef, disabled, readOnly, onChange, min, max, getPConnect]
  );

  const { start, end, rtl } = useDirection();

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (readOnly || disabled) return;
      if (
        [
          'ArrowDown',
          'ArrowUp',
          'ArrowLeft',
          'ArrowRight',
          'PageUp',
          'PageDown',
          'Home',
          'End'
        ].includes(e.key)
      )
        e.preventDefault();

      switch (e.key) {
        case 'ArrowDown':
        case `Arrow${cap(start)}`:
          setValue(currentValue - 1);
          break;
        case 'ArrowUp':
        case `Arrow${cap(end)}`:
          setValue(currentValue + 1);
          break;
        case 'PageUp':
          setValue(currentValue + 1);
          break;
        case 'PageDown':
          setValue(currentValue - 1);
          break;
        case 'Home':
          setValue(min);
          break;
        case 'End':
          setValue(max);
          break;
        default:
      }
    },
    [setValue, currentValue, start, end, disabled, max, min, readOnly]
  );

  useEffect(() => {
    setValue(value, true);
  }, [setValue, value]);

  useEffect(() => {
    if (autoFocus) starRatingRef.current?.focus();
  }, [autoFocus, starRatingRef]);

  // *** Thanks to shoelace
  // https://github.com/shoelace-style/shoelace/blob/next/src/components/rating/rating.component.ts
  const roundToPrecision = (numberToRound: number, precision = 1): number => {
    const multiplier = 1 / precision;
    return Math.ceil(numberToRound * multiplier) / multiplier;
  };

  const getValueFromXCoordinate = (coordinate: number): number => {
    const { left, right, width } =
      starRatingRef.current?.getBoundingClientRect() as DOMRect;
    const valueFromX = rtl
      ? roundToPrecision(((right - coordinate) / width) * max)
      : roundToPrecision(((coordinate - left) / width) * max);

    return Math.max(Math.min(valueFromX, max), min);
  };

  const getValueFromEventPosition = (
    event: MouseEvent | TouchEvent
  ): number => {
    const clientX =
      'touches' in event ? event.touches[0].clientX : event.clientX;
    return getValueFromXCoordinate(clientX);
  };
  //

  const onClick = (e: MouseEvent) => {
    if (readOnly || disabled) return;

    const newValue = getValueFromEventPosition(e);

    if (newValue === currentValue) {
      setValue(0);
      setInHovering(false);
      return;
    }
    setValue(newValue);
  };

  const onMouseEnter = (e: MouseEvent) => {
    if (readOnly || disabled) return;

    setInHovering(true);
    setCurrentHoverValue(getValueFromEventPosition(e));
  };

  const onMouseMove = (e: MouseEvent) => {
    if (readOnly || disabled) return;

    if (inHover) setCurrentHoverValue(getValueFromEventPosition(e));
  };

  const onMouseLeave = () => {
    if (readOnly || disabled) return;

    setInHovering(false);
    setCurrentHoverValue(currentValue);
  };

  const onTouchStart = (e: TouchEvent) => {
    if (readOnly || disabled) return;

    setInHovering(true);
    setCurrentHoverValue(getValueFromEventPosition(e));

    // Prevent scrolling when touch is initiated
    e.preventDefault();
  };

  const onTouchMove = (e: TouchEvent) => {
    if (readOnly || disabled) return;

    setCurrentHoverValue(getValueFromEventPosition(e));
  };

  const onTouchEnd = () => {
    if (readOnly || disabled) return;

    setInHovering(false);
  };

  return (
    <Flex container={{ direction: 'row' }}>
      <Flex
        id={id}
        as={StyledStarWrapper}
        ref={starRatingRef}
        container={{ direction: 'row', alignItems: 'start' }}
        role='slider'
        aria-label={label}
        aria-disabled={disabled ? 'true' : 'false'}
        aria-readonly={readOnly ? 'true' : 'false'}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        tabIndex={disabled ? '-1' : '0'}
        disabled={disabled}
        readOnly={readOnly}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onKeyDown={onKeyDown}
        onMouseLeave={onMouseLeave}
        style={{ display: 'inline-flex' }}
        data-test-id={testId}
        required={required}
      >
        <Flex item={{ shrink: 0 }}>
          {Array.from({ length: max }, (_, i) => {
            const rating = i + 1;
            const isSolid = rating <= currentHoverValue;
            return (
              <Icon
                className={`star ${disabled ? 'disabled' : ''} ${
                  readOnly ? 'readonly' : ''
                }`}
                key={`Icon-${i}`}
                name={isSolid ? 'star-solid' : 'star'}
              />
            );
          })}
        </Flex>
      </Flex>
      {metaInfoUpdated && (
        <Flex item={{ shrink: 0 }}>
          <StyledStarRatingMetaInfo>
            ({metaInfoUpdated})
          </StyledStarRatingMetaInfo>
        </Flex>
      )}
    </Flex>
  );
});

export default withConfiguration(SlDXExtensionsStarRating);
