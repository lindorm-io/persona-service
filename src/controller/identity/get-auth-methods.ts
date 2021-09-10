import Joi from "joi";
import { Context } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { JOI_GUID } from "../../constant";
import {
  getConnectedProviders,
  userinfoEmailGet,
  userinfoPhoneNumberGet,
} from "../../handler";

interface RequestData {
  id: string;
}

interface ResponseData {
  connectedOpenIdProviders: Array<string>;
  email: string | null;
  phoneNumber: string | null;
}

export const identityGetAuthMethodsSchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),
});

export const identityGetAuthMethodsController: Controller<
  Context<RequestData, ResponseData>
> = async (ctx): ControllerResponse<ResponseData> => {
  const {
    data: { id },
  } = ctx;

  const { email } = await userinfoEmailGet(ctx, id);
  const { phoneNumber } = await userinfoPhoneNumberGet(ctx, id);
  const connectedOpenIdProviders = await getConnectedProviders(ctx, id);

  return {
    data: {
      connectedOpenIdProviders,
      email,
      phoneNumber,
    },
  };
};
