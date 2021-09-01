import { Context } from "../../typing";
import { EntityNotFoundError } from "@lindorm-io/entity";
import { PhoneNumber } from "../../entity";

interface Options {
  identityId: string;
  phoneNumber: string;
}

export const userinfoPhoneNumberAdd = async (
  ctx: Context,
  options: Options,
): Promise<PhoneNumber> => {
  const {
    logger,
    repository: { phoneNumberRepository },
  } = ctx;

  logger.debug("userinfoPhoneNumberAdd", options);

  try {
    const { identityId, phoneNumber } = options;

    try {
      return await phoneNumberRepository.find({ phoneNumber });
    } catch (err: any) {
      if (!(err instanceof EntityNotFoundError)) {
        throw err;
      }
    }

    const amount = await phoneNumberRepository.count({ identityId });

    const entity = await phoneNumberRepository.create(
      new PhoneNumber({
        identityId,
        phoneNumber,
        primary: amount < 1,
        verified: false,
      }),
    );

    logger.debug("userinfoPhoneNumberAdd successful");

    return entity;
  } catch (err: any) {
    logger.error("userinfoPhoneNumberAdd failure", err);

    throw err;
  }
};
