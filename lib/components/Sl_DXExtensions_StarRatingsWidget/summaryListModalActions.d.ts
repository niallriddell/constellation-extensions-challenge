import { SummaryListItem } from '@pega/cosmos-react-core';
import { ModalAction } from './modalActions';
import type { Rating } from './ratingData';
export interface SummaryListItemModalAction extends SummaryListItem {
    actions: ModalAction[];
    rating: Rating;
}
export declare const createSummaryItem: (rating: Rating, getPConnect: () => typeof PConnect, caseKey?: string) => SummaryListItemModalAction;
//# sourceMappingURL=summaryListModalActions.d.ts.map