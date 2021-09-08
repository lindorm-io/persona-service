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
    repository: { phoneNumberRepository },
  } = ctx;

  await cryptoLayered.assert(code, session.code);

  const entity = await phoneNumberRepository.find({ phoneNumber: session.identifier });

  if (entity.verified) {
    throw new ClientError("Phone number is already verified");
  }

  entity.verified = true;

  await phoneNumberRepository.update(entity);
};
