import { Context } from "../../typing";
import { OpenIdIdentifier } from "../../entity";
import { EntityNotFoundError } from "@lindorm-io/entity";

interface Options {
  identityId: string;
  identifier: string;
  provider: string;
}

export const userinfoOpenIdIdentifierAdd = async (
  ctx: Context,
  options: Options,
): Promise<OpenIdIdentifier> => {
  const {
    repository: { openIdIdentifierRepository },
  } = ctx;

  const { identityId, identifier, provider } = options;

  try {
    return await openIdIdentifierRepository.find({ identifier, provider });
  } catch (err: any) {
    if (!(err instanceof EntityNotFoundError)) {
      throw err;
    }
  }

  return await openIdIdentifierRepository.create(
    new OpenIdIdentifier({
      identityId,
      identifier,
      provider,
    }),
  );
};
