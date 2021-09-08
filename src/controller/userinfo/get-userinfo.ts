import Joi from "joi";
import { Context, IdentityServiceClaims, ScopeHint, OpenIDClaims } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { JOI_GUID, SCOPE_HINT } from "../../constant";
import { TokenIssuer } from "@lindorm-io/jwt";
import { getAddress, getDisplayName, getName } from "../../util";
import { userinfoEmailGet, userinfoPhoneNumberGet } from "../../handler";

interface RequestData {
  id: string;
}

type ResponseData = OpenIDClaims & IdentityServiceClaims & { scopeHint: ScopeHint };

export const userinfoGetSchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),
});

export const userinfoGetController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse<ResponseData> => {
  const {
    entity: { identity },
  } = ctx;

  const {
    id,
    birthDate,
    familyName,
    gender,
    givenName,
    gravatar,
    locale,
    middleName,
    nickname,
    picture,
    preferredAccessibility,
    preferredUsername,
    profile,
    pronouns,
    socialSecurityNumber,
    updated,
    username,
    website,
    zoneInfo,
  } = identity;

  const address = getAddress(identity);
  const displayName = getDisplayName(identity);
  const name = getName(identity);

  const { email, emailVerified } = await userinfoEmailGet(ctx, identity.id);
  const { phoneNumber, phoneNumberVerified } = await userinfoPhoneNumberGet(
    ctx,
    identity.id,
  );

  return {
    data: {
      // always
      sub: id,
      updatedAt: TokenIssuer.getUnixTime(updated),
      scopeHint: SCOPE_HINT,

      // address
      address,

      // email
      email,
      emailVerified,

      // phone
      phoneNumber,
      phoneNumberVerified,

      // profile
      birthDate,
      displayName,
      familyName,
      gender,
      givenName,
      gravatar,
      locale,
      middleName,
      name,
      nickname,
      picture,
      preferredUsername,
      profile,
      pronouns,
      website,
      zoneInfo,

      // private
      preferredAccessibility,
      socialSecurityNumber,
      username,
    },
  };
};
