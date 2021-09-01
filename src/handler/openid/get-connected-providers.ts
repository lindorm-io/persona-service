import { Context } from "../../typing";

export const getConnectedProviders = async (
  ctx: Context,
  identityId: string,
): Promise<Array<string>> => {
  const {
    logger,
    repository: { openIdIdentifierRepository },
  } = ctx;

  logger.debug("getConnectedProviders", {
    identityId,
  });

  try {
    const array = await openIdIdentifierRepository.findMany({ identityId });
    const list: Array<string> = [];

    for (const item of array) {
      list.push(item.provider);
    }

    logger.debug("getConnectedProviders successful");

    return list;
  } catch (err: any) {
    logger.error("getConnectedProviders failure", err);

    throw err;
  }
};
