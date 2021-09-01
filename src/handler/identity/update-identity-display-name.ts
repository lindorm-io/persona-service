import { Context } from "../../typing";
import { Identity } from "../../entity";

export const updateIdentityDisplayName = async (
  ctx: Context,
  identity: Identity,
  displayName: string,
): Promise<void> => {
  const {
    logger,
    repository: { displayNameRepository },
  } = ctx;

  logger.debug("updateIdentityDisplayName", {
    identityId: identity.id,
    displayName,
  });

  try {
    if (identity.displayName.name) {
      const current = await displayNameRepository.find({
        name: identity.displayName.name,
      });

      current.remove(identity.displayName.number);

      await displayNameRepository.update(current);
    }

    const entity = await displayNameRepository.findOrCreate({ name: displayName });
    const number = await entity.generateNumber();

    entity.add(number);

    await displayNameRepository.update(entity);

    identity.displayName = {
      name: displayName,
      number,
    };

    logger.debug("updateIdentityDisplayName successful");
  } catch (err: any) {
    logger.error("updateIdentityDisplayName failure");

    throw err;
  }
};
