import { Context } from "../../typing";
import { orderBy } from "lodash";

interface Result {
  email: string | null;
  emailVerified: boolean;
}

const EMPTY: Result = {
  email: null,
  emailVerified: false,
};

export const userinfoEmailGet = async (
  ctx: Context,
  identityId: string,
): Promise<Result> => {
  const {
    logger,
    repository: { emailRepository },
  } = ctx;

  logger.debug("userinfoEmailGet", {
    identityId,
  });

  try {
    const array = await emailRepository.findMany({ identityId });
    const ordered = orderBy(
      array,
      ["verified", "primary", "updated"],
      ["desc", "desc", "desc"],
    );

    if (!ordered.length) return EMPTY;

    const { email, verified } = ordered[0];

    logger.debug("userinfoEmailGet successful");

    return {
      email,
      emailVerified: verified,
    };
  } catch (err: any) {
    logger.error("userinfoEmailGet failure", err);

    return EMPTY;
  }
};
