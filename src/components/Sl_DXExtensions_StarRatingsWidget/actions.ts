import { registerIcon, type Action } from '@pega/cosmos-react-core';
import * as pencil from '@pega/cosmos-react-core/lib/components/Icon/icons/pencil.icon';
import * as plus from '@pega/cosmos-react-core/lib/components/Icon/icons/plus.icon';
import * as trash from '@pega/cosmos-react-core/lib/components/Icon/icons/trash.icon';

registerIcon(pencil, plus, trash);

export const createAction = (
  actionType: 'Add' | 'Edit' | 'Delete',
  getPConnect: () => typeof PConnect
): Action => {

  const actionConfig = {
    'Add': {
      text: 'Add',
      id: 'rating:addNew',
      icon: 'plus',

    },
    'Edit': {
      text: 'Edit',
      id: 'rating:edit',
      icon: 'pencil'
    },
    'Delete': {
      text: 'Remove',
      id: 'rating:delete',
      icon: 'trash'
    }
  };

  const { text, id, icon } = actionConfig[actionType];
  return {
    text: getPConnect().getLocalizedValue(text),
    id,
    icon
  }
}
