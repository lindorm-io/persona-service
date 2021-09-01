import { ClientError } from "@lindorm-io/errors";
import { IdentifierType } from "../../../enum";
import { identifierAuthVerifyController } from "./verify";
import { logger } from "../../../test";

jest.mock("../../../handler", () => ({
  verifyEmail: jest.fn().mockResolvedValue({ id: "email", disabled: false }),
  verifyOpenIdIdentifier: jest.fn().mockResolvedValue({ id: "oidc", disabled: false }),
  verifyPhoneNumber: jest.fn().mockResolvedValue({ id: "phone", disabled: false }),
}));

describe("identifierAuthVerifyController", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      data: {
        email: "email",
        identifier: "identifier",
        phoneNumber: "phoneNumber",
        provider: "provider",
        type: "type",
        username: "username",
      },
      logger,
      repository: {
        identityRepository: {
          find: jest.fn().mockResolvedValue({ id: "username", disabled: false }),
        },
      },
    };
  });

  test("should resolve for EMAIL", async () => {
    ctx.data.type = IdentifierType.EMAIL;

    await expect(identifierAuthVerifyController(ctx)).resolves.toStrictEqual({
      data: {
        identityId: "email",
      },
    });
  });

  test("should resolve for PHONE_NUMBER", async () => {
    ctx.data.type = IdentifierType.PHONE_NUMBER;

    await expect(identifierAuthVerifyController(ctx)).resolves.toStrictEqual({
      data: {
        identityId: "phone",
      },
    });
  });

  test("should resolve for OIDC", async () => {
    ctx.data.type = IdentifierType.OIDC;

    await expect(identifierAuthVerifyController(ctx)).resolves.toStrictEqual({
      data: {
        identityId: "oidc",
      },
    });
  });

  test("should resolve for USERNAME", async () => {
    ctx.data.type = IdentifierType.USERNAME;

    await expect(identifierAuthVerifyController(ctx)).resolves.toStrictEqual({
      data: {
        identityId: "username",
      },
    });
  });

  test("should throw on unexpected type", async () => {
    await expect(identifierAuthVerifyController(ctx)).rejects.toThrow(ClientError);
  });
});
