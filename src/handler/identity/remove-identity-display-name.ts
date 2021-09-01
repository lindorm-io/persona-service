import { Context } from "../../typing";
import { Identity } from "../../entity";

export const removeIdentityDisplayName = async (
  ctx: Context,
  identity: Identity,
): Promise<void> => {
  const {
    logger,
    repository: { displayNameRepository },
  } = ctx;

  logger.debug("removeIdentityDisplayName", {
    identityId: identity.id,
  });

  try {
    if (!identity.displayName.name) {
      return;
    }

    const entity = await displayNameRepository.find({
      name: identity.displayName.name,
    });

    entity.remove(identity.displayName.number);

    await displayNameRepository.update(entity);

    logger.debug("removeIdentityDisplayName successful");
  } catch (err: any) {
    logger.error("removeIdentityDisplayName failure");

    throw err;
  }
};
