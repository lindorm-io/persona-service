import Joi from "joi";
import { Context } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { JOI_GUID } from "../../constant";
import { removeIdentityDisplayName } from "../../handler";

interface RequestData {
  id: string;
}

export const identityRemoveSchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),
});

export const identityRemoveController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse<Record<string, never>> => {
  const {
    entity: { identity },
    repository: {
      emailRepository,
      identityRepository,
      openIdIdentifierRepository,
      phoneNumberRepository,
    },
  } = ctx;

  if (identity.displayName.name) {
    await removeIdentityDisplayName(ctx, identity);
  }

  await emailRepository.removeMany({ identityId: identity.id });
  await openIdIdentifierRepository.removeMany({ identityId: identity.id });
  await phoneNumberRepository.removeMany({ identityId: identity.id });
  await identityRepository.remove(identity);

  return {
    data: {},
  };
};
