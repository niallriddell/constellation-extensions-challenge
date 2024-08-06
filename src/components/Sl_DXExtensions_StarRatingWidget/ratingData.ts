import type { DataAsyncResponse } from '@pega/pcore-pconnect-typedefs/data-view/types';
import type {
  Filter,
  Query
} from '@pega/pcore-pconnect-typedefs/datapage/types';
import BiMap from './bimap';

// All mapping between the component internal data model and the external data model
// is done here.  This is not strictly necessary and the approach taken here can be
// generalized further to dynamically map the external data model to the staic internal
// data model.  It's useful to define your internal data model in types so that you get
// the benefit of IDE auto-completion and type-checking at development time.

// Component data model
export type Rating = {
  caseClass: string;
  caseId: string;
  customerId: string;
  rating: number;
  stars: number;
  guid?: string;
  updateDateTime?: string;
};

// External data model
type RatingData = {
  CaseClassName: string;
  CaseID: string;
  CustomerID: string;
  CustomerRating: number;
  NumberOfStars: number;
  pyGUID?: string;
  pxUpdateDateTime?: string;
};

// Custom BiMap to allow two way lookup of keys
export const mapper = new BiMap<keyof Rating, keyof RatingData>();

mapper.set('caseClass', 'CaseClassName');
mapper.set('caseId', 'CaseID');
mapper.set('customerId', 'CustomerID');
mapper.set('rating', 'CustomerRating');
mapper.set('stars', 'NumberOfStars');
mapper.set('guid', 'pyGUID');
mapper.set('updateDateTime', 'pxUpdateDateTime');

// Utility funciton that auto-generates the select object.
// Currently adds all mapped properties.
function toSelectObject<K extends keyof Rating, V extends keyof RatingData>(
  biMap: BiMap<K, V>
): { select: { field: V }[] } {
  const arr: { field: V }[] = [];
  const keyToValueMap = biMap.getKeyToValueMap();
  keyToValueMap.forEach(value => {
    arr.push({ field: value });
  });
  return { select: arr };
}

// Utility function that transforms external data to internal
// data.  For large data sets this is likely to be to inefficient
// as we iterate the ecternal data and create a new internal one with
// the remapped keys.
function mapRatingDataToRating(
  ratingDataArray: Array<RatingData>,
  biMap: BiMap<keyof Rating, keyof RatingData>
): Array<Rating> {
  return ratingDataArray.map(ratingData => {
    const rating: Partial<Rating> = {};
    biMap.getKeyToValueMap().forEach((value, key) => {
      rating[key as keyof Rating] = ratingData[
        value as keyof RatingData
      ] as any;
    });
    return rating as Rating;
  });
}
// Uses getPageDataAsync api to fetch a single Rating.
// Returns a rating or undefined wrapped in a promise.
// Better error handling and recovery should be implemented
// for production solutions.  Here we just log thr error to
// the console.
export const getRating = async (
  dataView: string,
  guid: string,
  context?: string
): Promise<Rating | undefined> => {
  const guidProp: string | undefined = mapper.getValue('guid');

  if (!guidProp) return;

  const parameters = {
    [guidProp]: guid
  };

  const response = await PCore.getDataPageUtils().getPageDataAsync(
    dataView,
    context,
    parameters
  );

  return mapRatingDataToRating([response as RatingData], mapper)[0];
};

// Helper function that returns an array of ratings for a customerId.
export const getRatings = async (
  dataView: string,
  customerId?: string,
  context?: string
): Promise<Array<Rating> | undefined> => {
  const select = toSelectObject(mapper)?.select;

  const sortBy = [
    {
      field: mapper.getValue('updateDateTime'),
      type: 'DESC'
    }
  ];

  const filter: Filter = {
    logic: 'F1',
    filterConditions: {
      F1: {
        lhs: { field: mapper.getValue('customerId') as string },
        comparator: 'EQ',
        rhs: { value: customerId }
      }
    }
  };

  const query: Query = {
    select,
    sortBy,
    filter: customerId ? filter : undefined
  };

  const response: DataAsyncResponse =
    await PCore.getDataPageUtils().getDataAsync(
      dataView,
      context,
      undefined,
      undefined,
      query,
      { invalidateCache: true }
    );

  if (response.status === 200) {
    return mapRatingDataToRating(response.data as RatingData[], mapper);
  }

  return [];
};

// TODO: Add in the createDataObject rest api endpoint
export const updateRating = async (
  dataView: string,
  rating: Partial<Rating>,
  context?: string,
  classId?: string
): Promise<Rating | undefined> => {
  const optionsObject = {
    body: {
      data: {
        [mapper.getValue('rating') as string]: rating.rating,
        [mapper.getValue('stars') as string]: rating.stars,
        [mapper.getValue('caseId') as string]: rating.caseId,
        [mapper.getValue('customerId') as string]: rating.customerId,
        [mapper.getValue('caseClass') as string]: rating.caseClass,
        [mapper.getValue('guid') as string]: rating.guid
      }
    },
    queryPayload: {
      data_view_ID: dataView
    }
  };

  const response = await PCore.getRestClient().invokeRestApi(
    'updateDataObject',
    optionsObject,
    context
  );

  if (response?.status === 200) {
    if (classId) {
      PCore.getPubSubUtils().publish(
        PCore.getConstants().PUB_SUB_EVENTS.DATA_EVENTS.DATA_OBJECT_UPDATED,
        {
          classId,
          guid: response.data.responseData.pyGUID
        }
      );
    }
    return mapRatingDataToRating([response.data.responseData], mapper)[0];
  }
};

// TODO: Add in the createDataObject rest api endpoint
export const createRating = async (
  dataView: string,
  rating: Partial<Rating>,
  context?: string,
  classId?: string
): Promise<Rating | undefined> => {
  const optionsObject = {
    body: {
      data: {
        [mapper.getValue('rating') as string]: rating.rating,
        [mapper.getValue('stars') as string]: rating.stars,
        [mapper.getValue('caseId') as string]: rating.caseId,
        [mapper.getValue('customerId') as string]: rating.customerId,
        [mapper.getValue('caseClass') as string]: rating.caseClass
      }
    },
    queryPayload: {
      data_view_ID: dataView
    }
  };

  const response = await PCore.getRestClient().invokeRestApi(
    'createDataObject',
    optionsObject,
    context
  );

  if (response?.status === 200) {
    if (classId) {
      PCore.getPubSubUtils().publish(
        PCore.getConstants().PUB_SUB_EVENTS.DATA_EVENTS.DATA_OBJECT_CREATED,
        {
          classId,
          guid: response.data.responseData.pyGUID
        }
      );
    }
    return mapRatingDataToRating([response.data.responseData], mapper)[0];
  }
};
