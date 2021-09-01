import { ClientError } from "@lindorm-io/errors";
import { ConnectSession, PhoneNumber } from "../../entity";
import { Context } from "../../typing";
import { EntityNotFoundError } from "@lindorm-io/entity";
import { IdentifierType } from "../../enum";
import { config } from "../../config";
import { cryptoLayered } from "../../instance";
import { getRandomValue, stringToSeconds } from "@lindorm-io/core";

interface Options {
  identityId: string;
  phoneNumber: string;
}

export const connectPhoneNumberInitialise = async (
  ctx: Context,
  options: Options,
): Promise<void> => {
  const {
    axios: { communicationClient },
    cache: { connectSessionCache },
    logger,
    repository: { phoneNumberRepository },
  } = ctx;

  logger.debug("connectPhoneNumberInitialise", options);

  try {
    const { identityId, phoneNumber } = options;

    let entity: PhoneNumber;

    try {
      entity = await phoneNumberRepository.find({ phoneNumber });
    } catch (err: any) {
      if (!(err instanceof EntityNotFoundError)) {
        throw err;
      }

      entity = await phoneNumberRepository.create(
        new PhoneNumber({
          identityId,
          phoneNumber,
          primary: false,
          verified: false,
        }),
      );
    }

    if (entity.verified) {
      throw new ClientError("Phone number is already verified");
    }

    const expiresIn = stringToSeconds(config.EXPIRY_CONNECT_IDENTIFIER_SESSION);
    const code = getRandomValue(128);

    const session = await connectSessionCache.create(
      new ConnectSession({
        code: await cryptoLayered.encrypt(code),
        identifier: entity.phoneNumber,
        type: IdentifierType.PHONE_NUMBER,
      }),
      expiresIn,
    );

    await communicationClient.post("/private/connect-phone-number", {
      data: {
        code,
        phoneNumber: entity.phoneNumber,
        session: session.id,
      },
    });

    logger.debug("connectPhoneNumberInitialise successful");
  } catch (err: any) {
    logger.error("connectPhoneNumberInitialise failure", err);

    throw err;
  }
};
