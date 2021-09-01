import Joi from "joi";
import { Context } from "../../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { IdentifierType } from "../../../enum";
import { Identity } from "../../../entity";
import { JOI_EMAIL, JOI_IDENTIFIER_TYPE, JOI_PHONE_NUMBER } from "../../../constant";
import { ClientError } from "@lindorm-io/errors";
import { verifyEmail, verifyOpenIdIdentifier, verifyPhoneNumber } from "../../../handler";

interface RequestData {
  email: string;
  identifier: string;
  phoneNumber: string;
  provider: string;
  username: string;
  type: IdentifierType;
}

interface ResponseData {
  identityId: string;
}

export const identifierAuthVerifySchema = Joi.object<RequestData>({
  email: Joi.when("type", {
    is: IdentifierType.EMAIL,
    then: JOI_EMAIL.required(),
    otherwise: Joi.forbidden(),
  }),
  identifier: Joi.when("type", {
    is: IdentifierType.OIDC,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  phoneNumber: Joi.when("type", {
    is: IdentifierType.PHONE_NUMBER,
    then: JOI_PHONE_NUMBER.required(),
    otherwise: Joi.forbidden(),
  }),
  provider: Joi.when("type", {
    is: IdentifierType.OIDC,
    then: Joi.string().uri().required(),
    otherwise: Joi.forbidden(),
  }),
  username: Joi.when("type", {
    is: IdentifierType.USERNAME,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  type: JOI_IDENTIFIER_TYPE.required(),
});

export const identifierAuthVerifyController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse<ResponseData> => {
  const {
    data: { email, identifier, phoneNumber, provider, type, username },
    logger,
    repository: { identityRepository },
  } = ctx;

  logger.debug("identifierAuthVerifyController", ctx.data);

  try {
    let identity: Identity;

    switch (type) {
      case IdentifierType.EMAIL:
        identity = await verifyEmail(ctx, email);
        break;

      case IdentifierType.PHONE_NUMBER:
        identity = await verifyPhoneNumber(ctx, phoneNumber);
        break;

      case IdentifierType.OIDC:
        identity = await verifyOpenIdIdentifier(ctx, { identifier, provider });
        break;

      case IdentifierType.USERNAME:
        identity = await identityRepository.find({ username });
        break;

      default:
        throw new ClientError("Unexpected identifier type");
    }

    logger.debug("identifierAuthVerifyController successful");

    return {
      data: {
        identityId: identity.id,
      },
    };
  } catch (err: any) {
    logger.error("identifierAuthVerifyController failure", err);

    throw err;
  }
};
