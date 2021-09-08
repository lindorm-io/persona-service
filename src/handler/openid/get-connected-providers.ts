import { Context } from "../../typing";

export const getConnectedProviders = async (
  ctx: Context,
  identityId: string,
): Promise<Array<string>> => {
  const {
    repository: { openIdIdentifierRepository },
  } = ctx;

  const array = await openIdIdentifierRepository.findMany({ identityId });
  const list: Array<string> = [];

  for (const item of array) {
    list.push(item.provider);
  }

  return list;
};
