import { Context } from "../../typing";

interface Options {
  identityId: string;
  identifier: string;
}

export const removeOpenIdIdentifier = async (
  ctx: Context,
  options: Options,
): Promise<void> => {
  const {
    repository: { openIdIdentifierRepository },
  } = ctx;

  const { identityId, identifier } = options;

  const entity = await openIdIdentifierRepository.find({ identityId, identifier });

  await openIdIdentifierRepository.destroy(entity);
};
