import { Context } from "../../typing";

interface Options {
  identityId: string;
  identifier: string;
}

export const removeOpenIdIdentifier = async (
  ctx: Context,
  options: Options,
): Promise<void> => {
  const {
    logger,
    repository: { openIdIdentifierRepository },
  } = ctx;

  logger.debug("removeOpenIdIdentifier", options);

  try {
    const { identityId, identifier } = options;

    const entity = await openIdIdentifierRepository.find({ identityId, identifier });

    await openIdIdentifierRepository.remove(entity);

    logger.debug("removeOpenIdIdentifier successful");
  } catch (err: any) {
    logger.error("removeOpenIdIdentifier failure", err);

    throw err;
  }
};
