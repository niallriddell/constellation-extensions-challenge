// Generic handleResponse function
const createItems = <T, U>(
  data: T[],
  mapFunction: (entry: T, index: number) => U
): U[] => (data ? data.map(mapFunction) : []);

export default createItems;
