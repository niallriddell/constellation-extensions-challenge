import { type Action } from '@pega/cosmos-react-core';
export interface ModalAction extends Action {
    heading: string;
    content: string;
    actionType: 'Add' | 'Edit' | 'Delete';
}
export declare const createAction: (actionType: 'Add' | 'Edit' | 'Delete', getPConnect: () => typeof PConnect) => ModalAction;
//# sourceMappingURL=modalActions.d.ts.map