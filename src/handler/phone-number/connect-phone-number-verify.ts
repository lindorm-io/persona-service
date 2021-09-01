import { ClientError } from "@lindorm-io/errors";
import { ConnectSession } from "../../entity";
import { Context } from "../../typing";
import { cryptoLayered } from "../../instance";

export const connectPhoneNumberVerify = async (
  ctx: Context,
  session: ConnectSession,
  code: string,
): Promise<void> => {
  const {
    logger,
    repository: { phoneNumberRepository },
  } = ctx;

  logger.debug("connectPhoneNumberVerify", {
    identifier: session.identifier,
    sessionId: session.id,
    type: session.type,
  });

  try {
    await cryptoLayered.assert(code, session.code);

    const entity = await phoneNumberRepository.find({ phoneNumber: session.identifier });

    if (entity.verified) {
      throw new ClientError("Phone number is already verified");
    }

    entity.verified = true;

    await phoneNumberRepository.update(entity);

    logger.debug("connectPhoneNumberVerify successful");
  } catch (err: any) {
    logger.error("connectPhoneNumberVerify failure", err);

    throw err;
  }
};
