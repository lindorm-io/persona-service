import { ClientError } from "@lindorm-io/errors";
import { IdentifierType } from "../../../enum";
import { identifierConnectVerifyController } from "./verify";
import {
  connectEmailVerify as _connectEmailVerify,
  connectPhoneNumberVerify as _connectPhoneNumberVerify,
} from "../../../handler";

jest.mock("../../../handler", () => ({
  connectEmailVerify: jest.fn(),
  connectPhoneNumberVerify: jest.fn(),
}));

const connectEmailVerify = _connectEmailVerify as jest.Mock;
const connectPhoneNumberVerify = _connectPhoneNumberVerify as jest.Mock;

describe("identifierConnectVerifyController", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      data: {
        code: "code",
      },
      entity: {
        connectSession: { type: "type" },
      },
    };
  });

  test("should resolve for EMAIL", async () => {
    ctx.entity.connectSession.type = IdentifierType.EMAIL;

    await expect(identifierConnectVerifyController(ctx)).resolves.toStrictEqual({
      data: {},
    });

    expect(connectEmailVerify).toHaveBeenCalled();
  });

  test("should resolve for PHONE_NUMBER", async () => {
    ctx.entity.connectSession.type = IdentifierType.PHONE_NUMBER;

    await expect(identifierConnectVerifyController(ctx)).resolves.toStrictEqual({
      data: {},
    });

    expect(connectPhoneNumberVerify).toHaveBeenCalled();
  });

  test("should throw on unexpected type", async () => {
    await expect(identifierConnectVerifyController(ctx)).rejects.toThrow(ClientError);
  });
});
