import type { Rating } from './ratingData';

// Demonstrates the ability to have different filter functions if required.
export type SearchFunction<T> = (obj: T, str: string) => boolean;

const searchByRating: SearchFunction<Rating> = (
  rating: Rating,
  search: string
): boolean => {
  return rating.rating <= Number.parseInt(search, 10);
};

const searchByCustomer: SearchFunction<Rating> = (
  rating: Rating,
  search: string
): boolean => {
  return rating.customerId === search;
};

export { searchByCustomer, searchByRating };
