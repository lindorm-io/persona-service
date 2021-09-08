import Joi from "joi";
import { Context, OpenIDClaims } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { IdentityEvent } from "../../enum";
import { shouldUserinfoReplace } from "../../util";
import {
  JOI_BIRTHDATE,
  JOI_EMAIL,
  JOI_GUID,
  JOI_LOCALE,
  JOI_OPENID_ADDRESS,
  JOI_PHONE_NUMBER,
  JOI_ZONE_INFO,
} from "../../constant";
import {
  userinfoEmailAdd,
  userinfoOpenIdIdentifierAdd,
  userinfoPhoneNumberAdd,
  userinfoUsernameAdd,
} from "../../handler";

type RequestData = OpenIDClaims & {
  id: string;
  provider: string;
};

export const userinfoAddSchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),

  provider: Joi.string().uri().required(),
  sub: Joi.string().required(),
  updatedAt: Joi.number().required(),

  address: JOI_OPENID_ADDRESS.optional(),
  birthDate: JOI_BIRTHDATE.optional(),
  email: JOI_EMAIL.optional(),
  emailVerified: Joi.boolean().optional(),
  familyName: Joi.string().optional(),
  gender: Joi.string().optional(),
  givenName: Joi.string().optional(),
  locale: JOI_LOCALE.optional(),
  middleName: Joi.string().optional(),
  nickname: Joi.string().optional(),
  phoneNumber: JOI_PHONE_NUMBER.optional(),
  phoneNumberVerified: Joi.boolean().optional(),
  picture: Joi.string().uri().optional(),
  preferredUsername: Joi.string().optional(),
  profile: Joi.string().uri().optional(),
  website: Joi.string().uri().optional(),
  zoneInfo: JOI_ZONE_INFO.optional(),
});

export const userinfoAddController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse<Record<string, never>> => {
  const {
    data: {
      address,
      birthDate,
      email,
      familyName,
      gender,
      givenName,
      locale,
      middleName,
      nickname,
      phoneNumber,
      picture,
      preferredUsername,
      profile,
      provider,
      sub,
      updatedAt,
      website,
      zoneInfo,
    },

    entity: { identity },
    repository: { identityRepository },
  } = ctx;

  const { id: identityId } = identity;

  if (
    (address?.country ||
      address?.locality ||
      address?.postalCode ||
      address?.region ||
      address?.streetAddress) &&
    shouldUserinfoReplace(identity, IdentityEvent.ADDRESS_CHANGED, updatedAt)
  ) {
    identity.address = {
      country: address?.country,
      locality: address?.locality,
      postalCode: address?.postalCode,
      region: address?.region,
      streetAddress: address?.streetAddress.split("\n"),
    };
  }

  if (
    birthDate &&
    shouldUserinfoReplace(identity, IdentityEvent.BIRTH_DATE_CHANGED, updatedAt)
  ) {
    identity.birthDate = birthDate;
  }

  if (
    familyName &&
    shouldUserinfoReplace(identity, IdentityEvent.FAMILY_NAME_CHANGED, updatedAt)
  ) {
    identity.familyName = familyName;
  }

  if (
    gender &&
    shouldUserinfoReplace(identity, IdentityEvent.GENDER_CHANGED, updatedAt)
  ) {
    identity.gender = gender;
  }

  if (
    givenName &&
    shouldUserinfoReplace(identity, IdentityEvent.GIVEN_NAME_CHANGED, updatedAt)
  ) {
    identity.givenName = givenName;
  }

  if (
    locale &&
    shouldUserinfoReplace(identity, IdentityEvent.LOCALE_CHANGED, updatedAt)
  ) {
    identity.locale = locale;
  }

  if (
    middleName &&
    shouldUserinfoReplace(identity, IdentityEvent.MIDDLE_NAME_CHANGED, updatedAt)
  ) {
    identity.middleName = middleName;
  }

  if (
    nickname &&
    shouldUserinfoReplace(identity, IdentityEvent.NICKNAME_CHANGED, updatedAt)
  ) {
    identity.nickname = nickname;
  }

  if (
    picture &&
    shouldUserinfoReplace(identity, IdentityEvent.PICTURE_CHANGED, updatedAt)
  ) {
    identity.picture = picture;
  }

  if (
    profile &&
    shouldUserinfoReplace(identity, IdentityEvent.PROFILE_CHANGED, updatedAt)
  ) {
    identity.profile = profile;
  }

  if (
    preferredUsername &&
    shouldUserinfoReplace(identity, IdentityEvent.USERNAME_CHANGED, updatedAt)
  ) {
    identity.preferredUsername = preferredUsername;
  }

  if (
    website &&
    shouldUserinfoReplace(identity, IdentityEvent.WEBSITE_CHANGED, updatedAt)
  ) {
    identity.website = website;
  }

  if (
    zoneInfo &&
    shouldUserinfoReplace(identity, IdentityEvent.ZONE_INFO_CHANGED, updatedAt)
  ) {
    identity.zoneInfo = zoneInfo;
  }

  await identityRepository.update(identity);

  if (email) {
    await userinfoEmailAdd(ctx, {
      identityId,
      email,
    });
  }

  if (phoneNumber) {
    await userinfoPhoneNumberAdd(ctx, {
      identityId,
      phoneNumber,
    });
  }

  await userinfoOpenIdIdentifierAdd(ctx, {
    identityId,
    identifier: sub,
    provider,
  });

  await userinfoUsernameAdd(ctx, identity);

  return {
    data: {},
  };
};
