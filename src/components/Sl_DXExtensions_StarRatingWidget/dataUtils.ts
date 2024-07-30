// Generic handleResponse function
const createItems = <T, U>(
  data: T[],
  getPConnect: () => typeof PConnect,
  mapFunction: (
    entry: T,
    getPConnect: () => typeof PConnect,
    index: number
  ) => U
): U[] =>
  data
    ? data.map((entry, index) => mapFunction(entry, getPConnect, index))
    : [];

export default createItems;
