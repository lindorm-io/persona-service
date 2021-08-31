import { ClientError } from "@lindorm-io/errors";
import { IdentifierType } from "../../../enum";
import { identifierConnectInitialiseController } from "./initialise";
import {
  connectEmailInitialise as _connectEmailInitialise,
  connectPhoneNumberInitialise as _connectPhoneNumberInitialise,
} from "../../../handler";
import { getTestIdentity } from "../../../test";

jest.mock("../../../handler", () => ({
  connectEmailInitialise: jest.fn(),
  connectPhoneNumberInitialise: jest.fn(),
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
    };
  });

  test("should resolve for EMAIL", async () => {
    ctx.data.type = IdentifierType.EMAIL;

    await expect(identifierConnectInitialiseController(ctx)).resolves.toStrictEqual({
      data: {},
    });

    expect(connectEmailInitialise).toHaveBeenCalled();
  });

  test("should resolve for PHONE_NUMBER", async () => {
    ctx.data.type = IdentifierType.PHONE_NUMBER;

    await expect(identifierConnectInitialiseController(ctx)).resolves.toStrictEqual({
      data: {},
    });

    expect(connectPhoneNumberInitialise).toHaveBeenCalled();
  });

  test("should throw on unexpected type", async () => {
    await expect(identifierConnectInitialiseController(ctx)).rejects.toThrow(ClientError);
  });
});
