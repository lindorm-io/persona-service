import { Context } from "../../typing";
import { Email, Identity } from "../../entity";
import { EntityNotFoundError } from "@lindorm-io/entity";

export const verifyEmail = async (ctx: Context, email: string): Promise<Identity> => {
  const {
    logger,
    repository: { identityRepository, emailRepository },
  } = ctx;

  logger.debug("verifyEmail", {
    email,
  });

  try {
    try {
      const entity = await emailRepository.find({ email });

      return await identityRepository.find({ id: entity.identityId });
    } catch (err: any) {
      if (!(err instanceof EntityNotFoundError)) {
        throw err;
      }

      const identity = await identityRepository.create(new Identity({}));

      await emailRepository.create(
        new Email({
          email,
          identityId: identity.id,
          primary: true,
          verified: true,
        }),
      );

      logger.debug("verifyEmail successful");

      return identity;
    }
  } catch (err: any) {
    logger.error("verifyEmail failure", err);

    throw err;
  }
};
