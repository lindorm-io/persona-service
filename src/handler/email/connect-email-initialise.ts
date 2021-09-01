import { ConnectSession, Email } from "../../entity";
import { Context } from "../../typing";
import { EntityNotFoundError } from "@lindorm-io/entity";
import { IdentifierType } from "../../enum";
import { config } from "../../config";
import { cryptoLayered } from "../../instance";
import { getRandomValue, stringToSeconds } from "@lindorm-io/core";
import { ClientError } from "@lindorm-io/errors";

interface Options {
  identityId: string;
  email: string;
}

export const connectEmailInitialise = async (
  ctx: Context,
  options: Options,
): Promise<void> => {
  const {
    axios: { communicationClient },
    cache: { connectSessionCache },
    logger,
    repository: { emailRepository },
  } = ctx;

  logger.debug("connectEmailInitialise", options);

  try {
    const { identityId, email } = options;

    let entity: Email;

    try {
      entity = await emailRepository.find({ email });
    } catch (err: any) {
      if (!(err instanceof EntityNotFoundError)) {
        throw err;
      }

      entity = await emailRepository.create(
        new Email({
          identityId,
          email,
          primary: false,
          verified: false,
        }),
      );
    }

    if (entity.verified) {
      throw new ClientError("Email is already verified");
    }

    const expiresIn = stringToSeconds(config.EXPIRY_CONNECT_IDENTIFIER_SESSION);
    const code = getRandomValue(128);

    const session = await connectSessionCache.create(
      new ConnectSession({
        code: await cryptoLayered.encrypt(code),
        identifier: entity.email,
        type: IdentifierType.EMAIL,
      }),
      expiresIn,
    );

    await communicationClient.post("/private/connect-email", {
      data: {
        code,
        email: entity.email,
        session: session.id,
      },
    });

    logger.debug("connectEmailInitialise successful");
  } catch (err: any) {
    logger.error("connectEmailInitialise failure");

    throw err;
  }
};
