import Joi from "joi";
import { IdentifierType, NamingSystem } from "../enum";

export const JOI_BIRTHDATE = Joi.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);

export const JOI_EMAIL = Joi.string()
  .case("lower")
  .email({
    minDomainSegments: 2,
    tlds: { deny: [] },
  });

export const JOI_GUID = Joi.string().guid({ version: "uuidv4" });

export const JOI_IDENTIFIER_TYPE = Joi.string().valid(
  IdentifierType.EMAIL,
  IdentifierType.PHONE_NUMBER,
  IdentifierType.OIDC,
  IdentifierType.USERNAME,
);

export const JOI_IDENTITY_ADDRESS = Joi.object({
  country: Joi.string().allow(null).required(),
  locality: Joi.string().allow(null).required(),
  postalCode: Joi.string().allow(null).required(),
  region: Joi.string().allow(null).required(),
  streetAddress: Joi.array().items(Joi.string()).required(),
});

export const JOI_IDENTITY_DISPLAY_NAME = Joi.object({
  name: Joi.string().allow(null).required(),
  number: Joi.number().allow(null).required(),
});

export const JOI_LOCALE = Joi.string().regex(/^[a-z]{2}-[A-Z]{2}$/);

export const JOI_NAMING_SYSTEM = Joi.string().valid(
  NamingSystem.GIVEN_FAMILY,
  NamingSystem.FAMILY_GIVEN,
);

export const JOI_OPENID_ADDRESS = Joi.object({
  country: Joi.string().allow(null).required(),
  locality: Joi.string().allow(null).required(),
  postalCode: Joi.string().allow(null).required(),
  region: Joi.string().allow(null).required(),
  streetAddress: Joi.string().allow(null).required(),
});

export const JOI_PHONE_NUMBER = Joi.string().regex(/^\+?[1-9]\d{1,14}$/);

export const JOI_SIGNATURE = Joi.string().base64();

export const JOI_ZONE_INFO = Joi.string().regex(
  /^([A-Z][a-z]+)\/([A-Z][a-z]+)(_[A-Z][a-z]+)*$/,
);
