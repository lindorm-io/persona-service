import { Context } from "../../typing";
import { Identity, OpenIdIdentifier } from "../../entity";
import { EntityNotFoundError } from "@lindorm-io/entity";

interface Options {
  identifier: string;
  provider: string;
}

export const verifyOpenIdIdentifier = async (
  ctx: Context,
  options: Options,
): Promise<Identity> => {
  const {
    logger,
    repository: { identityRepository, openIdIdentifierRepository },
  } = ctx;

  logger.debug("verifyOpenIdIdentifier", options);

  try {
    const { identifier, provider } = options;

    try {
      const entity = await openIdIdentifierRepository.find({ identifier, provider });

      return await identityRepository.find({ id: entity.identityId });
    } catch (err: any) {
      if (!(err instanceof EntityNotFoundError)) {
        throw err;
      }

      const identity = await identityRepository.create(new Identity({}));

      await openIdIdentifierRepository.create(
        new OpenIdIdentifier({
          identityId: identity.id,
          identifier,
          provider,
        }),
      );

      logger.debug("verifyOpenIdIdentifier successful");

      return identity;
    }
  } catch (err: any) {
    logger.error("verifyOpenIdIdentifier failure", err);

    throw err;
  }
};
