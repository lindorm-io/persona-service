import { ConnectSession } from "../../entity";
import { Context } from "../../typing";
import { cryptoLayered } from "../../instance";
import { ClientError } from "@lindorm-io/errors";

export const connectEmailVerify = async (
  ctx: Context,
  session: ConnectSession,
  code: string,
): Promise<void> => {
  const {
    repository: { emailRepository },
  } = ctx;

  await cryptoLayered.assert(code, session.code);

  const entity = await emailRepository.find({ email: session.identifier });

  if (entity.verified) {
    throw new ClientError("Email is already verified");
  }

  entity.verified = true;

  await emailRepository.update(entity);
};
