import { Context } from "../../typing";
import { EntityNotFoundError } from "@lindorm-io/entity";
import { Identity, PhoneNumber } from "../../entity";

export const verifyPhoneNumber = async (
  ctx: Context,
  phoneNumber: string,
): Promise<Identity> => {
  const {
    logger,
    repository: { identityRepository, phoneNumberRepository },
  } = ctx;

  logger.debug("verifyPhoneNumber", {
    phoneNumber,
  });

  try {
    try {
      const entity = await phoneNumberRepository.find({ phoneNumber });

      return await identityRepository.find({ id: entity.identityId });
    } catch (err: any) {
      if (!(err instanceof EntityNotFoundError)) {
        throw err;
      }

      const identity = await identityRepository.create(new Identity({}));

      await phoneNumberRepository.create(
        new PhoneNumber({
          identityId: identity.id,
          phoneNumber,
          primary: true,
          verified: true,
        }),
      );

      logger.debug("verifyPhoneNumber successful");

      return identity;
    }
  } catch (err: any) {
    logger.error("verifyPhoneNumber failure", err);

    throw err;
  }
};
