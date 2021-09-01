import { Context } from "../../typing";
import { Identity } from "../../entity";
import { EntityNotUpdatedError } from "@lindorm-io/entity";

export const userinfoUsernameAdd = async (
  ctx: Context,
  identity: Identity,
): Promise<void> => {
  const {
    logger,
    repository: { identityRepository },
  } = ctx;

  logger.debug("userinfoUsernameAdd", {
    identityId: identity.id,
    preferredUsername: identity.preferredUsername,
    username: identity.username,
  });

  if (!identity.preferredUsername || identity.username) {
    logger.debug("userinfoUsernameAdd skip");

    return;
  }

  try {
    identity.username = identity.preferredUsername;

    await identityRepository.update(identity);

    logger.debug("userinfoUsernameAdd successful");
  } catch (err: any) {
    logger.debug("userinfoUsernameAdd failure", err);

    if (!(err instanceof EntityNotUpdatedError)) {
      throw err;
    }
  }
};
