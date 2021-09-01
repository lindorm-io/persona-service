import { Context } from "../../typing";
import { orderBy } from "lodash";

interface Result {
  phoneNumber: string | null;
  phoneNumberVerified: boolean;
}

const EMPTY: Result = {
  phoneNumber: null,
  phoneNumberVerified: false,
};

export const userinfoPhoneNumberGet = async (
  ctx: Context,
  identityId: string,
): Promise<Result> => {
  const {
    logger,
    repository: { phoneNumberRepository },
  } = ctx;

  logger.debug("userinfoPhoneNumberGet", { identityId });

  try {
    const array = await phoneNumberRepository.findMany({ identityId });

    const ordered = orderBy(
      array,
      ["verified", "primary", "updated"],
      ["desc", "desc", "desc"],
    );

    if (!ordered.length) return EMPTY;

    const { phoneNumber, verified } = ordered[0];

    logger.debug("userinfoPhoneNumberGet successful");

    return {
      phoneNumber,
      phoneNumberVerified: verified,
    };
  } catch (err: any) {
    logger.error("userinfoPhoneNumberGet failure", err);

    return EMPTY;
  }
};
