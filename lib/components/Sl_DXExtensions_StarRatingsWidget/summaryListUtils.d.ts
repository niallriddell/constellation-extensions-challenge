import { SummaryListItem } from '@pega/cosmos-react-core';
import type { Rating } from './ratingData';
export interface StarRatingSummaryListItem extends SummaryListItem {
    rating: Rating;
}
export declare const createSummaryItem: (rating: Rating, getPConnect: () => typeof PConnect, caseKey?: string) => StarRatingSummaryListItem;
//# sourceMappingURL=summaryListUtils.d.ts.map