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
    logger,
    repository: { emailRepository },
  } = ctx;

  logger.debug("connectEmailVerify", {
    identifier: session.identifier,
    sessionId: session.id,
    type: session.type,
  });

  try {
    await cryptoLayered.assert(code, session.code);

    const entity = await emailRepository.find({ email: session.identifier });

    if (entity.verified) {
      throw new ClientError("Email is already verified");
    }

    entity.verified = true;

    await emailRepository.update(entity);

    logger.debug("connectEmailVerify successful");
  } catch (err: any) {
    logger.error("connectEmailVerify failure");

    throw err;
  }
};
