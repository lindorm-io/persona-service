import { ClientError } from "@lindorm-io/errors";
import { IdentifierType } from "../../../enum";
import { getTestConnectSession, getTestIdentity, logger } from "../../../test";
import { identifierConnectInitialiseController } from "./initialise";
import {
  connectEmailInitialise as _connectEmailInitialise,
  connectPhoneNumberInitialise as _connectPhoneNumberInitialise,
} from "../../../handler";

jest.mock("../../../handler", () => ({
  connectEmailInitialise: jest.fn().mockResolvedValue(
    getTestConnectSession({
      id: "4b55a038-3615-444f-9221-d9086b564427",
    }),
  ),
  connectPhoneNumberInitialise: jest.fn().mockResolvedValue(
    getTestConnectSession({
      id: "86f78995-6511-4fab-b9e4-574e2f2e3c13",
    }),
  ),
}));

const connectEmailInitialise = _connectEmailInitialise as jest.Mock;
const connectPhoneNumberInitialise = _connectPhoneNumberInitialise as jest.Mock;

describe("identifierConnectInitialiseController", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      data: {
        id: "identityId",
        email: "email",
        phoneNumber: "phoneNumber",
        type: "type",
      },
      entity: {
        identity: getTestIdentity({ id: "identityId" }),
      },
      logger,
    };
  });

  test("should resolve for EMAIL", async () => {
    ctx.data.type = IdentifierType.EMAIL;

    await expect(identifierConnectInitialiseController(ctx)).resolves.toStrictEqual({
      data: {
        sessionId: "4b55a038-3615-444f-9221-d9086b564427",
      },
    });

    expect(connectEmailInitialise).toHaveBeenCalled();
  });

  test("should resolve for PHONE_NUMBER", async () => {
    ctx.data.type = IdentifierType.PHONE_NUMBER;

    await expect(identifierConnectInitialiseController(ctx)).resolves.toStrictEqual({
      data: {
        sessionId: "86f78995-6511-4fab-b9e4-574e2f2e3c13",
      },
    });

    expect(connectPhoneNumberInitialise).toHaveBeenCalled();
  });

  test("should throw on unexpected type", async () => {
    await expect(identifierConnectInitialiseController(ctx)).rejects.toThrow(ClientError);
  });
});
