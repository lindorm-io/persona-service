import Joi from "joi";
import { Context, IdentityAddress } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import {
  JOI_BIRTHDATE,
  JOI_GUID,
  JOI_IDENTITY_ADDRESS,
  JOI_IDENTITY_DISPLAY_NAME,
  JOI_LOCALE,
  JOI_NAMING_SYSTEM,
  JOI_ZONE_INFO,
} from "../../constant";
import { NamingSystem, Scope } from "../../enum";
import { includes, isEqual } from "lodash";
import { updateIdentityDisplayName } from "../../handler";

interface RequestData {
  id: string;

  address: IdentityAddress;
  birthDate: string;
  displayName: string;
  familyName: string;
  gender: string;
  givenName: string;
  gravatar: string;
  locale: string;
  middleName: string;
  namingSystem: NamingSystem;
  nickname: string;
  picture: string;
  preferredAccessibility: Array<string>;
  preferredUsername: string;
  profile: string;
  pronouns: string;
  socialSecurityNumber: string;
  username: string;
  website: string;
  zoneInfo: string;
}

export const identityUpdateSchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),

  address: JOI_IDENTITY_ADDRESS.optional(),
  birthDate: JOI_BIRTHDATE.allow(null).optional(),
  displayName: JOI_IDENTITY_DISPLAY_NAME.optional(),
  familyName: Joi.string().allow(null).optional(),
  gender: Joi.string().allow(null).optional(),
  givenName: Joi.string().allow(null).optional(),
  gravatar: Joi.string().uri().allow(null).optional(),
  locale: JOI_LOCALE.allow(null).optional(),
  middleName: Joi.string().allow(null).optional(),
  namingSystem: JOI_NAMING_SYSTEM.optional(),
  nickname: Joi.string().allow(null).optional(),
  picture: Joi.string().uri().allow(null).optional(),
  preferredAccessibility: Joi.array().items(Joi.string()).optional(),
  preferredUsername: Joi.string().allow(null).optional(),
  profile: Joi.string().uri().allow(null).optional(),
  pronouns: Joi.string().allow(null).optional(),
  socialSecurityNumber: Joi.string().allow(null).optional(),
  username: Joi.string().lowercase().allow(null).optional(),
  website: Joi.string().uri().allow(null).optional(),
  zoneInfo: JOI_ZONE_INFO.allow(null).optional(),
});

export const identityUpdateController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse<Record<string, never>> => {
  const {
    data: {
      address,
      birthDate,
      displayName,
      familyName,
      gender,
      givenName,
      gravatar,
      locale,
      middleName,
      namingSystem,
      nickname,
      picture,
      preferredAccessibility,
      preferredUsername,
      profile,
      pronouns,
      socialSecurityNumber,
      username,
      website,
      zoneInfo,
    },
    entity: { identity },
    repository: { identityRepository },
    token: {
      bearerToken: { scopes },
    },
  } = ctx;

  if (includes(scopes, Scope.ADDRESS)) {
    if (address && !isEqual(identity.address, address)) {
      identity.address = address;
    }
  }

  if (includes(scopes, Scope.PROFILE)) {
    if (birthDate && birthDate !== identity.birthDate) {
      identity.birthDate = birthDate;
    }

    if (displayName && displayName !== identity.displayName.name) {
      await updateIdentityDisplayName(ctx, identity, displayName);
    }

    if (familyName && familyName !== identity.familyName) {
      identity.familyName = familyName;
    }

    if (gender && gender !== identity.gender) {
      identity.gender = gender;
    }

    if (givenName && givenName !== identity.givenName) {
      identity.givenName = givenName;
    }

    if (gravatar && gravatar !== identity.gravatar) {
      identity.gravatar = gravatar;
    }

    if (locale && locale !== identity.locale) {
      identity.locale = locale;
    }

    if (middleName && middleName !== identity.middleName) {
      identity.middleName = middleName;
    }

    if (namingSystem && namingSystem !== identity.namingSystem) {
      identity.namingSystem = namingSystem;
    }

    if (nickname && nickname !== identity.nickname) {
      identity.nickname = nickname;
    }

    if (picture && picture !== identity.picture) {
      identity.picture = picture;
    }

    if (
      preferredAccessibility &&
      !isEqual(preferredAccessibility, identity.preferredAccessibility)
    ) {
      identity.preferredAccessibility = preferredAccessibility;
    }

    if (preferredUsername && preferredUsername !== identity.preferredUsername) {
      identity.preferredUsername = preferredUsername;
    }

    if (profile && profile !== identity.profile) {
      identity.profile = profile;
    }

    if (pronouns && pronouns !== identity.pronouns) {
      identity.pronouns = pronouns;
    }

    if (website && website !== identity.website) {
      identity.website = website;
    }

    if (zoneInfo && zoneInfo !== identity.zoneInfo) {
      identity.zoneInfo = zoneInfo;
    }
  }

  if (includes(scopes, Scope.PRIVATE)) {
    if (socialSecurityNumber && socialSecurityNumber !== identity.socialSecurityNumber) {
      identity.socialSecurityNumber = socialSecurityNumber;
    }

    if (username && username !== identity.username) {
      identity.username = username;
    }
  }

  await identityRepository.update(identity);

  return {
    data: {},
  };
};
