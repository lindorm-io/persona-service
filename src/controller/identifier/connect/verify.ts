import Joi from "joi";
import { ClientError } from "@lindorm-io/errors";
import { Context } from "../../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { IdentifierType } from "../../../enum";
import { JOI_GUID } from "../../../constant";
import { connectEmailVerify, connectPhoneNumberVerify } from "../../../handler";

interface RequestData {
  id: string;
  code: string;
}

export const identifierConnectVerifySchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),
  code: Joi.string().required(),
});

export const identifierConnectVerifyController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse => {
  const {
    data: { code },
    entity: { connectSession },
  } = ctx;

  switch (connectSession.type) {
    case IdentifierType.EMAIL:
      await connectEmailVerify(ctx, connectSession, code);
      break;

    case IdentifierType.PHONE_NUMBER:
      await connectPhoneNumberVerify(ctx, connectSession, code);
      break;

    default:
      throw new ClientError("Unexpected identifier type");
  }

  return {
    data: {},
  };
};
