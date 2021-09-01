import { Context } from "../../typing";
import { EntityNotFoundError } from "@lindorm-io/entity";

interface Options {
  identityId: string;
  email: string;
}

export const setPrimaryEmail = async (ctx: Context, options: Options): Promise<void> => {
  const {
    logger,
    repository: { emailRepository },
  } = ctx;

  logger.debug("setPrimaryEmail", options);

  try {
    const { identityId, email } = options;

    try {
      const currentPrimary = await emailRepository.find({ identityId, primary: true });

      currentPrimary.primary = false;

      await emailRepository.update(currentPrimary);
    } catch (err: any) {
      if (!(err instanceof EntityNotFoundError)) {
        throw err;
      }
    }

    const newPrimary = await emailRepository.find({ identityId, email });

    if (newPrimary.primary) {
      return;
    }

    newPrimary.primary = true;

    await emailRepository.update(newPrimary);

    logger.debug("setPrimaryEmail successful");
  } catch (err: any) {
    logger.error("setPrimaryEmail failure", err);

    throw err;
  }
};
