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
import { ConnectSession } from "../../../entity";

interface RequestData {
  id: string;
  type: IdentifierType;

  email: string;
  phoneNumber: string;
}

interface ResponseData {
  sessionId: string;
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
  async (ctx): ControllerResponse<ResponseData> => {
    const {
      data: { email, phoneNumber, type },
      entity: { identity },
    } = ctx;

    let session: ConnectSession;

    switch (type) {
      case IdentifierType.EMAIL:
        session = await connectEmailInitialise(ctx, identity, email);
        break;

      case IdentifierType.PHONE_NUMBER:
        session = await connectPhoneNumberInitialise(ctx, identity, phoneNumber);
        break;

      default:
        throw new ClientError("Unexpected identifier type");
    }

    return {
      data: {
        sessionId: session.id,
      },
    };
  };
