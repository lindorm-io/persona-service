import { ClientError } from "@lindorm-io/errors";
import { ConnectSession, Identity, PhoneNumber } from "../../entity";
import { Context } from "../../typing";
import { EntityNotFoundError } from "@lindorm-io/entity";
import { IdentifierType } from "../../enum";
import { config } from "../../config";
import { cryptoLayered } from "../../instance";
import { getName } from "../../util";
import { getRandomNumber, stringToSeconds } from "@lindorm-io/core";

export const connectPhoneNumberInitialise = async (
  ctx: Context,
  identity: Identity,
  phoneNumber: string,
): Promise<ConnectSession> => {
  const {
    axios: { communicationClient },
    cache: { connectSessionCache },
    logger,
    repository: { phoneNumberRepository },
  } = ctx;

  logger.debug("connectPhoneNumberInitialise", {
    identityId: identity.id,
    phoneNumber,
  });

  let entity: PhoneNumber;

  try {
    entity = await phoneNumberRepository.find({ phoneNumber });
  } catch (err: any) {
    if (!(err instanceof EntityNotFoundError)) {
      throw err;
    }

    entity = await phoneNumberRepository.create(
      new PhoneNumber({
        identityId: identity.id,
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
  const code = await getRandomNumber(6);

  const session = await connectSessionCache.create(
    new ConnectSession({
      code: await cryptoLayered.encrypt(code.toString()),
      identifier: entity.phoneNumber,
      type: IdentifierType.PHONE_NUMBER,
    }),
    expiresIn,
  );

  await communicationClient.post("/private/send/sms", {
    data: {
      code,
      expiresIn,
      name: getName(identity),
      phoneNumber: entity.phoneNumber,
      template: "connect-phone-number",
    },
  });

  return session;
};
