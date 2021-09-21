import { ConnectSession, ConnectSessionOptions } from "../../entity";
import { IdentifierType } from "../../enum";
import { cryptoLayered } from "../../instance";
import { getRandomString } from "@lindorm-io/core";

export const getTestConnectSession = async (
  options: Partial<ConnectSessionOptions> = {},
): Promise<ConnectSession> =>
  new ConnectSession({
    code: await cryptoLayered.encrypt("secret"),
    identifier: `${getRandomString(16)}@lindorm.io`,
    type: IdentifierType.EMAIL,
    ...options,
  });
