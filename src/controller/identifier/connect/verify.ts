import Joi from "joi";
import { ClientError } from "@lindorm-io/errors";
import { Context } from "../../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { IdentifierType } from "../../../enum";
import { JOI_GUID } from "../../../constant";
import { connectEmailVerify, connectPhoneNumberVerify } from "../../../handler";

interface RequestData {
  code: string;
  session: string;
}

export const identifierConnectVerifySchema = Joi.object<RequestData>({
  code: Joi.string().required(),
  session: JOI_GUID.required(),
});

export const identifierConnectVerifyController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse<Record<string, never>> => {
  const {
    data: { code },
    entity: { connectSession },
    logger,
  } = ctx;

  logger.debug("identifierConnectVerifyController");

  try {
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

    logger.debug("identifierConnectVerifyController successful");

    return {
      data: {},
    };
  } catch (err: any) {
    logger.error("identifierConnectVerifyController failure", err);

    throw err;
  }
};
