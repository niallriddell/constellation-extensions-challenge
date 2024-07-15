import type { Filter, Query } from "@pega/pcore-pconnect-typedefs/datapage/types";
import { BiMap } from "./bimap";

export type Rating = {
  caseClass: string;
  caseId: string;
  customerId: string;
  rating: number;
  stars: number;
  guid?: string;
  updateDateTime?: string;
}

type RatingData = {
  CaseClassName: string;
  CaseID: string;
  CustomerID: string;
  CustomerRating: number;
  NumberOfStars: number;
  pyGUID?: string;
  pxUpdateDateTime?: string;
}

export const mapper = new BiMap<keyof Rating, keyof RatingData>;

mapper.set('caseClass', 'CaseClassName');
mapper.set('caseId', 'CaseID');
mapper.set('customerId', 'CustomerID');
mapper.set('rating', 'CustomerRating');
mapper.set('stars', 'NumberOfStars');
mapper.set('guid', 'pyGUID');
mapper.set('updateDateTime', 'pxUpdateDateTime');

function toSelectObject<
  K extends keyof Rating,
  V extends keyof RatingData>
  (biMap: BiMap<K, V>): { select: { field: V }[] } {

  const arr: { field: V }[] = [];
  const keyToValueMap = biMap.getKeyToValueMap();
  keyToValueMap.forEach((value) => {
    arr.push({ field: value });
  });
  return { select: arr };
}

function mapRatingDataToRating(ratingDataArray: Array<RatingData>,
  biMap: BiMap<keyof Rating, keyof RatingData>)
  : Array<Rating> {

  return ratingDataArray.map(ratingData => {
    const rating: Partial<Rating> = {};
    biMap.getKeyToValueMap().forEach((value, key) => {
      rating[key as keyof Rating] =
        ratingData[value as keyof RatingData] as any;
    });
    return rating as Rating;
  });
}
// TODO: use getPageDataAsync to fetch a single Rating 
export const getRating = async (
  dataView: string,
  guid: string,
  context?: string): Promise<Rating | undefined> => {

  const guidProp: string | undefined = mapper.getValue('guid');

  if (!guidProp) return;

  const parameters = {
    [guidProp]: guid
  }

  try {
    const response: any = await PCore
      .getDataPageUtils()
      .getPageDataAsync(dataView, context, parameters);

    if (response.status === 200) {
      return mapRatingDataToRating([response.data], mapper)[0];
    }
  } catch (error) {
    console.error(error);
  }
}

interface RatingDataResponse {
  data: any[] | RatingData[];
  status?: number;
}

export const getRatings = async (
  dataView: string,
  customerId?: string,
  context?: string
): Promise<Array<Rating> | undefined> => {

  const select = toSelectObject(mapper)?.select;

  const sortBy = [{
    field: mapper.getValue('updateDateTime'),
    type: "DESC"
  }];

  const filter: Filter = {
    logic: "F1",
    filterConditions: {
      F1: {
        lhs: { field: mapper.getValue('customerId') as string },
        comparator: "EQ",
        rhs: { value: customerId }
      }
    }
  };

  const query: Query = {
    select,
    sortBy,
    filter: customerId ? filter : undefined
  };

  try {
    const response: RatingDataResponse = await PCore
      .getDataPageUtils()
      .getDataAsync(
        dataView,
        context,
        undefined,
        undefined,
        query,
        { invalidateCache: true }
      );

    if (response.status === 200) {
      return mapRatingDataToRating(response.data, mapper);
    }

    return [];

  } catch (error) { console.error(error) }
}

