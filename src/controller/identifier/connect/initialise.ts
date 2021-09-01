import Joi from "joi";
import { Context } from "../../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { IdentifierType } from "../../../enum";
import {
  JOI_EMAIL,
  JOI_GUID,
  JOI_IDENTIFIER_TYPE,
  JOI_PHONE_NUMBER,
} from "../../../constant";
import { ClientError } from "@lindorm-io/errors";
import { connectEmailInitialise, connectPhoneNumberInitialise } from "../../../handler";

interface RequestData {
  id: string;
  type: IdentifierType;

  email: string;
  phoneNumber: string;
}

export const identifierConnectInitialiseSchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),
  type: JOI_IDENTIFIER_TYPE.required(),

  email: Joi.when("type", {
    is: IdentifierType.EMAIL,
    then: JOI_EMAIL.required(),
    otherwise: Joi.forbidden(),
  }),
  phoneNumber: Joi.when("type", {
    is: IdentifierType.PHONE_NUMBER,
    then: JOI_PHONE_NUMBER.required(),
    otherwise: Joi.forbidden(),
  }),
});

export const identifierConnectInitialiseController: Controller<Context<RequestData>> =
  async (ctx): ControllerResponse<Record<string, never>> => {
    const {
      data: { email, phoneNumber, type },
      entity: { identity },
      logger,
    } = ctx;

    logger.debug("identifierConnectInitialiseController", ctx.data);

    try {
      switch (type) {
        case IdentifierType.EMAIL:
          await connectEmailInitialise(ctx, {
            identityId: identity.id,
            email,
          });
          break;

        case IdentifierType.PHONE_NUMBER:
          await connectPhoneNumberInitialise(ctx, {
            identityId: identity.id,
            phoneNumber,
          });
          break;

        default:
          throw new ClientError("Unexpected identifier type");
      }

      logger.debug("identifierConnectInitialiseController successful");

      return {
        data: {},
      };
    } catch (err: any) {
      logger.error("identifierConnectInitialiseController failure", err);

      throw err;
    }
  };
