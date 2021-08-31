import { Context } from "../../typing";
import { EntityNotFoundError } from "@lindorm-io/entity";
import { Identity, PhoneNumber } from "../../entity";

export const verifyPhoneNumber = async (
  ctx: Context,
  phoneNumber: string,
): Promise<Identity> => {
  const {
    repository: { identityRepository, phoneNumberRepository },
  } = ctx;

  try {
    const entity = await phoneNumberRepository.find({ phoneNumber });

    return await identityRepository.find({ id: entity.identityId });
  } catch (err) {
    if (!(err instanceof EntityNotFoundError)) {
      throw err;
    }

    const identity = await identityRepository.create(new Identity({}));

    await phoneNumberRepository.create(
      new PhoneNumber({
        identityId: identity.id,
        phoneNumber,
        primary: true,
        verified: true,
      }),
    );

    return identity;
  }
};
