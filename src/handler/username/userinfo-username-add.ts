import { Context } from "../../typing";
import { Identity } from "../../entity";
import { EntityNotUpdatedError } from "@lindorm-io/entity";

export const userinfoUsernameAdd = async (
  ctx: Context,
  identity: Identity,
): Promise<void> => {
  const {
    repository: { identityRepository },
  } = ctx;

  if (!identity.preferredUsername || identity.username) return;

  try {
    identity.username = identity.preferredUsername;

    await identityRepository.update(identity);
  } catch (err) {
    if (!(err instanceof EntityNotUpdatedError)) {
      throw err;
    }
  }
};
