import type { Query } from "@pega/pcore-pconnect-typedefs/datapage/types";
import { BiMap } from "./bimap";

export type TransformFunction<InputValue, OutputValue> = (
  value: InputValue,
  inputData: any,
) => OutputValue;

export type TransformMap<InputData, OutputData> = {
  [K in keyof InputData]?: TransformFunction<
    InputData[K],
    OutputData[keyof OutputData]
  >;
};
export type SortBy<T> = Array<{ field: keyof T; type: "ASC" | "DESC" }>;

export type Filter<OutputData> = {
  filterConditions: {
    [k: string]: {
      lhs: {
        field: keyof OutputData;
      };
      rhs: {
        value?: string;
        values?: string[];
      };
      comparator: string;
      ignoreCase?: string;
    };
  };
  logic: string;
};
const mapDataToData = <
  InputData extends { [K in keyof InputData]?: any },
  OutputData extends { [K in keyof OutputData]?: any },
>(
  inputData: InputData[],
  biMap: BiMap<keyof OutputData, keyof InputData>,
  transformMap?: TransformMap<InputData, OutputData>,
): void => {
  const processObject = (obj: any): void => {
    if (Array.isArray(obj)) {
      obj.forEach((item) => processObject(item));
    } else if (obj !== null && typeof obj === "object") {
      Object.keys(obj).forEach((key) => {
        const inputKey = key as keyof InputData;
        const outputKey = biMap.getKey(inputKey);
        if (outputKey !== undefined) {
          const transformFn = transformMap?.[inputKey];
          if (transformFn) {
            obj[outputKey] = transformFn(obj[inputKey], obj);
          } else {
            obj[outputKey] = obj[inputKey];
          }
          if ((inputKey as string) !== (outputKey as string)) {
            delete obj[inputKey];
          }
          processObject(obj[outputKey]);
        }
      });
    }
  };

  processObject(inputData);
};

// Generic handleResponse function
const handleResponse = <T, U>(
  data: T[],
  mapFunction: (entry: T, index: number) => U,
): U[] => (data ? data.map(mapFunction) : []);

// Utility function that auto-generates the select object.
// Currently adds all mapped properties.
const toSelectObject = <K, V>(
  biMap: BiMap<K, V>,
): { select: { field: V }[] } => {
  const arr: { field: V }[] = [];
  const keyToValueMap = biMap.getKeyToValueMap();
  keyToValueMap.forEach((value) => {
    arr.push({ field: value });
  });
  return { select: arr };
};

const getDataItems = async <
  InputData extends { [K in keyof InputData]?: any },
  OutputData extends { [K in keyof OutputData]?: any },
>(
  dataView: string,
  mapper: BiMap<keyof OutputData, keyof InputData>,
  sortBy?: Array<{ field: keyof OutputData; type: "ASC" | "DESC" }>,
  filter?: Filter<OutputData>,
  context?: string,
  transFormMap?: TransformMap<InputData, OutputData>,
): Promise<Array<OutputData> | undefined> => {
  const select = toSelectObject(mapper)?.select;
  const query: Query = {
    select,
    ...(sortBy && {
      sortBy: sortBy.map((sort) => ({
        field: mapper.getValue(sort.field),
        type: sort.type,
      })),
    }),
    ...(filter && {
      filter: {
        filterConditions: Object.fromEntries(
          Object.entries(filter.filterConditions).map(([key, condition]) => [
            key,
            {
              ...condition,
              lhs: {
                field: mapper.getValue(
                  condition.lhs.field as keyof OutputData,
                ) as string,
              },
            },
          ]),
        ),
        logic: filter.logic,
      },
    }),
  };

  try {
    const response = await PCore.getDataPageUtils().getDataAsync(
      dataView,
      context,
      undefined,
      undefined,
      query,
      { invalidateCache: true },
    );
    mapDataToData(response.data as InputData[], mapper, transFormMap);
    return response.data as OutputData[];
  } catch (error) {
    console.error(error);
  }
};

export { handleResponse, getDataItems };
