import { ClientError } from "@lindorm-io/errors";
import { ConnectSession, Email, Identity } from "../../entity";
import { Context } from "../../typing";
import { EntityNotFoundError } from "@lindorm-io/entity";
import { IdentifierType } from "../../enum";
import { config } from "../../config";
import { cryptoLayered } from "../../instance";
import { getName } from "../../util";
import { getRandomNumber, stringToSeconds } from "@lindorm-io/core";

export const connectEmailInitialise = async (
  ctx: Context,
  identity: Identity,
  email: string,
): Promise<ConnectSession> => {
  const {
    axios: { communicationClient },
    cache: { connectSessionCache },
    repository: { emailRepository },
  } = ctx;

  let entity: Email;

  try {
    entity = await emailRepository.find({ email });
  } catch (err: any) {
    if (!(err instanceof EntityNotFoundError)) {
      throw err;
    }

    entity = await emailRepository.create(
      new Email({
        identityId: identity.id,
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
  const code = await getRandomNumber(6);

  const session = await connectSessionCache.create(
    new ConnectSession({
      code: await cryptoLayered.encrypt(code.toString()),
      identifier: entity.email,
      type: IdentifierType.EMAIL,
    }),
    expiresIn,
  );

  await communicationClient.post("/private/send/email", {
    data: {
      code,
      email: entity.email,
      expiresIn,
      name: getName(identity),
      template: "connect-email",
    },
  });

  return session;
};
