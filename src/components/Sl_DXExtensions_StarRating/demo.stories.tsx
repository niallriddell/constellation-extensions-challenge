import type { Meta, StoryObj } from '@storybook/react';
import StarRating from './index';

import type ActionsApi from '@pega/pcore-pconnect-typedefs/actions/api';

const meta: Meta = {
  title: 'SL/Star Rating Component',
  component: StarRating,
  parameters: {
    controls: { expanded: false }
  }
};

export default meta;

type Story = StoryObj<typeof StarRating>;

const mockActionsApi: Partial<ActionsApi> = {
  updateFieldValue: () => {},
  triggerFieldChange: () => {}
};

const mockPConnect = (): Partial<typeof PConnect> => ({
  getValue: () => undefined,
  getStateProps: () => {
    return { value: '.rating' };
  },
  getActionsApi: () => mockActionsApi as ActionsApi
});

export const onChangeExternal: Story = {
  args: {
    value: 3,
    max: 5,
    autoFocus: true,
    disabled: false,
    readOnly: false,
    label: 'Aria label'
  },
  render: args => {
    return (
      <div>
        <StarRating {...args} onChange={(newValue: number) => (args.value = newValue)} />
      </div>
    );
  }
};

export const onChangeInternal: Story = {
  args: {
    value: 3,
    max: 5,
    autoFocus: true,
    disabled: false,
    readOnly: false,
    label: 'Aria label',
    getPConnect: mockPConnect as () => typeof PConnect
  },
  render: args => {
    return (
      <div>
        <StarRating {...args} />
      </div>
    );
  }
};
