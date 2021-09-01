import { Context } from "../../typing";
import { OpenIdIdentifier } from "../../entity";
import { EntityNotFoundError } from "@lindorm-io/entity";

interface Options {
  identityId: string;
  identifier: string;
  provider: string;
}

export const userinfoOpenIdIdentifierAdd = async (
  ctx: Context,
  options: Options,
): Promise<OpenIdIdentifier> => {
  const {
    logger,
    repository: { openIdIdentifierRepository },
  } = ctx;

  logger.debug("userinfoOpenIdIdentifierAdd", options);

  try {
    const { identityId, identifier, provider } = options;

    try {
      return await openIdIdentifierRepository.find({ identifier, provider });
    } catch (err: any) {
      if (!(err instanceof EntityNotFoundError)) {
        throw err;
      }
    }

    const entity = await openIdIdentifierRepository.create(
      new OpenIdIdentifier({
        identityId,
        identifier,
        provider,
      }),
    );

    logger.debug("userinfoOpenIdIdentifierAdd successful");

    return entity;
  } catch (err: any) {
    logger.debug("userinfoOpenIdIdentifierAdd failure", err);

    throw err;
  }
};
