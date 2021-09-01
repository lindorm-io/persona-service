import { Context } from "../../typing";
import { Email } from "../../entity";
import { EntityNotFoundError } from "@lindorm-io/entity";

interface Options {
  identityId: string;
  email: string;
}

export const userinfoEmailAdd = async (
  ctx: Context,
  options: Options,
): Promise<Email> => {
  const {
    logger,
    repository: { emailRepository },
  } = ctx;

  logger.debug("userinfoEmailAdd", options);

  try {
    const { identityId, email } = options;

    try {
      return await emailRepository.find({ email });
    } catch (err: any) {
      if (!(err instanceof EntityNotFoundError)) {
        throw err;
      }
    }

    const amount = await emailRepository.count({ identityId });

    const entity = await emailRepository.create(
      new Email({
        identityId,
        email,
        primary: amount < 1,
        verified: false,
      }),
    );

    logger.debug("userinfoEmailAdd successful");

    return entity;
  } catch (err: any) {
    logger.error("userinfoEmailAdd failure", err);

    throw err;
  }
};
