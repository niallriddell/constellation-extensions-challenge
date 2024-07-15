import { Rating } from './ratingData';
export interface SearchFunction<T> {
    (obj: T, str: string): boolean;
}
declare const searchByRating: SearchFunction<Rating>;
declare const searchByCustomer: SearchFunction<Rating>;
export { searchByCustomer, searchByRating };
//# sourceMappingURL=searchFunctions.d.ts.map