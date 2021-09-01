import Joi from "joi";
import { Context, IdentityAddress } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { JOI_GUID } from "../../constant";
import { Scope } from "../../enum";
import { getConnectedProviders } from "../../handler";
import { getDisplayName } from "../../util";
import { includes } from "lodash";

interface RequestData {
  id: string;
}

interface ResponseData {
  address: IdentityAddress;
  birthDate: string;
  connectedProviders: Array<string>;
  displayName: string;
  emails: Array<{
    email: string;
    primary: boolean;
    verified: boolean;
  }>;
  familyName: string;
  gender: string;
  givenName: string;
  gravatar: string;
  locale: string;
  middleName: string;
  nickname: string;
  phoneNumbers: Array<{
    phoneNumber: string;
    primary: boolean;
    verified: boolean;
  }>;
  picture: string;
  preferredUsername: string;
  profile: string;
  pronouns: string;
  socialSecurityNumber: string;
  username: string;
  website: string;
  zoneInfo: string;
}

export const identityGetSchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),
});

export const identityGetController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse<Partial<ResponseData>> => {
  const {
    entity: { identity },
    logger,
    repository: { emailRepository, phoneNumberRepository },
    token: {
      bearerToken: { scopes },
    },
  } = ctx;

  logger.debug("identityGetController", ctx.data);

  try {
    const data: Partial<ResponseData> = {};

    if (includes(scopes, Scope.ADDRESS)) {
      data.address = identity.address;
    }

    if (includes(scopes, Scope.EMAIL)) {
      data.emails = [];

      const list = await emailRepository.findMany({ identityId: identity.id });

      for (const item of list) {
        data.emails.push({
          email: item.email,
          primary: item.primary,
          verified: item.verified,
        });
      }
    }

    if (includes(scopes, Scope.PHONE)) {
      data.phoneNumbers = [];

      const list = await phoneNumberRepository.findMany({ identityId: identity.id });

      for (const item of list) {
        data.phoneNumbers.push({
          phoneNumber: item.phoneNumber,
          primary: item.primary,
          verified: item.verified,
        });
      }
    }

    if (includes(scopes, Scope.PROFILE)) {
      data.birthDate = identity.birthDate;
      data.displayName = getDisplayName(identity);
      data.familyName = identity.familyName;
      data.gender = identity.gender;
      data.givenName = identity.givenName;
      data.gravatar = identity.gravatar;
      data.locale = identity.locale;
      data.middleName = identity.middleName;
      data.nickname = identity.nickname;
      data.picture = identity.picture;
      data.preferredUsername = identity.preferredUsername;
      data.profile = identity.profile;
      data.pronouns = identity.pronouns;
      data.website = identity.website;
      data.zoneInfo = identity.zoneInfo;
    }

    if (includes(scopes, Scope.PRIVATE)) {
      data.connectedProviders = await getConnectedProviders(ctx, identity.id);
      data.socialSecurityNumber = identity.socialSecurityNumber;
      data.username = identity.username;
    }

    logger.debug("identityGetController successful");

    return {
      data,
    };
  } catch (err: any) {
    logger.error("identityGetController failure", err);

    throw err;
  }
};
