import { ConnectSession, ConnectSessionOptions } from "../../entity";
import { cryptoLayered } from "../../instance";
import { IdentifierType } from "../../enum";

export const getTestConnectSession = async (
  options: Partial<ConnectSessionOptions> = {},
): Promise<ConnectSession> =>
  new ConnectSession({
    code: await cryptoLayered.encrypt("secret"),
    identifier: "test@lindorm.io",
    type: IdentifierType.EMAIL,
    ...options,
  });
