import { Context } from "../../typing";
import { ClientError } from "@lindorm-io/errors";

interface Options {
  identityId: string;
  phoneNumber: string;
}

export const removePhoneNumber = async (
  ctx: Context,
  options: Options,
): Promise<void> => {
  const {
    repository: { phoneNumberRepository },
  } = ctx;

  const { identityId, phoneNumber } = options;

  const entity = await phoneNumberRepository.find({ identityId, phoneNumber });

  if (entity.primary) {
    throw new ClientError("Unable to remove primary phoneNumber");
  }

  await phoneNumberRepository.remove(entity);
};
