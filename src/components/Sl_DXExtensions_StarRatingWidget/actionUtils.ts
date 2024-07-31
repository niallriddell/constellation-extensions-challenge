import { registerIcon, type Action } from '@pega/cosmos-react-core';
import * as pencil from '@pega/cosmos-react-core/lib/components/Icon/icons/pencil.icon';
import * as plus from '@pega/cosmos-react-core/lib/components/Icon/icons/plus.icon';
import * as trash from '@pega/cosmos-react-core/lib/components/Icon/icons/trash.icon';

registerIcon(pencil, plus, trash);

export type ActionWithDataItem<T> = (
  dataItem?: T,
  ...onClickArgs: Parameters<NonNullable<Action['onClick']>>
) => void;

function isActionWithDataItem<T>(
  func: ActionWithDataItem<T> | Action['onClick']
): func is ActionWithDataItem<T> {
  return func !== undefined && func.length > 3;
}

const createAction = <T>(
  actionType: 'Add' | 'Edit' | 'Delete',
  getPConnect: () => typeof PConnect,
  onClickHandler: ActionWithDataItem<T> | Action['onClick'],
  dataItem?: T
): Action => {
  const actionConfig = {
    Add: {
      text: 'Add',
      id: 'addNew',
      icon: 'plus'
    },
    Edit: {
      text: 'Edit',
      id: 'edit',
      icon: 'pencil'
    },
    Delete: {
      text: 'Remove',
      id: 'delete',
      icon: 'trash'
    }
  };

  const { text, id, icon } = actionConfig[actionType];
  return {
    text: getPConnect().getLocalizedValue(text),
    id,
    icon,
    onClick: (...args) => {
      if (onClickHandler === undefined) return undefined;
      if (isActionWithDataItem(onClickHandler)) {
        onClickHandler(dataItem, ...args);
      } else {
        onClickHandler(...args);
      }
    }
  };
};

export default createAction;
