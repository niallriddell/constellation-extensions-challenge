import { BiMap } from "./bimap";
export type Rating = {
    caseClass: string;
    caseId: string;
    customerId: string;
    rating: number;
    stars: number;
    guid?: string;
    updateDateTime?: string;
};
type RatingData = {
    CaseClassName: string;
    CaseID: string;
    CustomerID: string;
    CustomerRating: number;
    NumberOfStars: number;
    pyGUID?: string;
    pxUpdateDateTime?: string;
};
export declare const mapper: BiMap<keyof Rating, keyof RatingData>;
export declare const getRating: (dataView: string, guid: string, context?: string) => Promise<Rating | undefined>;
export declare const getRatings: (dataView: string, customerId?: string, context?: string) => Promise<Array<Rating> | undefined>;
export {};
//# sourceMappingURL=ratingData.d.ts.map