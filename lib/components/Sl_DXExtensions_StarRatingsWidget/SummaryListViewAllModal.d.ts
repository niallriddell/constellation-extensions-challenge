import type { Action } from "@pega/cosmos-react-core";
import type { Rating } from "./ratingData";
import { SearchFunction } from "./searchFunctions";
import { StarRatingSummaryListItem } from "./summaryListUtils";
export interface SummaryListViewAllProps {
    name: string;
    loading: boolean;
    items: Array<StarRatingSummaryListItem>;
    actions: Array<Action>;
    searchFunction: SearchFunction<Rating>;
    currentRating: Rating;
    onUpdateRating: (newRating: Rating) => void;
}
declare const _default: (props: SummaryListViewAllProps) => JSX.Element;
export default _default;
//# sourceMappingURL=SummaryListViewAllModal.d.ts.map