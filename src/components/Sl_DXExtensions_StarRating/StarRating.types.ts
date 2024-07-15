import type { RatingProps, TestIdProp, FormControlProps } from '@pega/cosmos-react-core';

export interface StarRatingProps extends RatingProps, TestIdProp {
  /**
   * Sets DOM id for the control and associates label element via 'for' attribute.
   * If an id is not pass, a random id will be generated for any render.
   */
  id?: FormControlProps['id'];
  /** Pass a string or a fragment with an Icon and string. */
  label?: FormControlProps['label'];
  /** Visually hides the label region. */
  labelHidden?: FormControlProps['labelHidden'];
  /** It is recommended to pass a simple string to offer guidance. Text will be styled based on status prop. */
  info?: FormControlProps['info'];
  /** Indicate if the field is required. The browser defaults to false. */
  required?: FormControlProps['required'];
  /**
   * Creates a controlled input and sets the value. Requires an onChange handler to update value.
   * value + onChange is the recommended method per React team.
   */
  value: number;
  /** Disable the control. The browser defaults to false. */
  disabled?: FormControlProps['disabled'];
  /** Makes the input non editable and non clickable. The browser defaults to false. */
  readOnly?: FormControlProps['readOnly'];
  /** Sets html name attribute for the underlying control. Useful for mapping to a data field. */
  name?: FormControlProps['name'];
  /** Will automatically focus the thumb on render if true */
  autoFocus?: boolean;
  /**
   * Minimum value.
   * @default 0
   */
  min?: number;
  /**
   * Maximum value.
   * @default 100
   */
  max?: number;
  /**
   * Show current value.
   * @default false
   */
  preview?: boolean;
  /**
   * Display input to provide value.
   * @default true
   */
  showInput?: boolean;
  /** Pass a heading and content to show additional information on the field. */
  additionalInfo?: FormControlProps['additionalInfo'];
  /**
   * On change callback.
   * @param value new input value
   */
  onChange: (value: number) => void;
  /** Called when the user starts dragging the slider thumb. */
  onDragStart?: () => void;
  /** Called when the user stops dragging the slider thumb. */
  onDragEnd?: () => void;
}
