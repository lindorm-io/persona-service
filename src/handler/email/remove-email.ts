import { Context } from "../../typing";
import { ClientError } from "@lindorm-io/errors";

interface Options {
  identityId: string;
  email: string;
}

export const removeEmail = async (ctx: Context, options: Options): Promise<void> => {
  const {
    logger,
    repository: { emailRepository },
  } = ctx;

  logger.debug("removeEmail", options);

  try {
    const { identityId, email } = options;

    const entity = await emailRepository.find({ identityId, email });

    if (entity.primary) {
      throw new ClientError("Unable to remove primary email");
    }

    await emailRepository.remove(entity);

    logger.debug("removeEmail successful");
  } catch (err: any) {
    logger.error("removeEmail failure", err);

    throw err;
  }
};
