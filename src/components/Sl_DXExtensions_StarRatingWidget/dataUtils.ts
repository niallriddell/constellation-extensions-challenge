// Generic handleResponse function
const handleResponse = <T, U>(
  data: T[],
  mapFunction: (entry: T, index: number) => U
): U[] => (data ? data.map(mapFunction) : []);

export default handleResponse;
