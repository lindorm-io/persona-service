import { Context } from "../../typing";
import { EntityNotFoundError } from "@lindorm-io/entity";

interface Options {
  identityId: string;
  phoneNumber: string;
}

export const setPrimaryPhoneNumber = async (
  ctx: Context,
  options: Options,
): Promise<void> => {
  const {
    logger,
    repository: { phoneNumberRepository },
  } = ctx;

  logger.debug("setPrimaryPhoneNumber", options);

  try {
    const { identityId, phoneNumber } = options;

    try {
      const currentPrimary = await phoneNumberRepository.find({
        identityId,
        primary: true,
      });

      currentPrimary.primary = false;

      await phoneNumberRepository.update(currentPrimary);
    } catch (err: any) {
      if (!(err instanceof EntityNotFoundError)) {
        throw err;
      }
    }

    const newPrimary = await phoneNumberRepository.find({ identityId, phoneNumber });

    newPrimary.primary = true;

    await phoneNumberRepository.update(newPrimary);

    logger.debug("setPrimaryPhoneNumber successful");
  } catch (err: any) {
    logger.error("setPrimaryPhoneNumber failure", err);

    throw err;
  }
};
