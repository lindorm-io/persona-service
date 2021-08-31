import { inMemoryAxios } from "./in-memory";

export const getAxiosResponse = (method: string, name: string, path: string): any => {
  return { data: inMemoryAxios[`${method.toUpperCase()}::${name}::${path}`] };
};

export const setAxiosResponse = (
  method: string,
  name: string,
  path: string,
  data: any,
): void => {
  inMemoryAxios[`${method.toUpperCase()}::${name}::${path}`] = data;
};
