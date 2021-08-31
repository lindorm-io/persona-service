import { ClientError } from "@lindorm-io/errors";
import { IdentifierType } from "../../enum";
import { identifierRemoveController } from "./remove";
import {
  removeEmail as _removeEmail,
  removePhoneNumber as _removePhoneNumber,
  removeOpenIdIdentifier as _removeOpenIdIdentifier,
} from "../../handler";
import { getTestIdentity } from "../../test";

jest.mock("../../handler", () => ({
  removeEmail: jest.fn(),
  removePhoneNumber: jest.fn(),
  removeOpenIdIdentifier: jest.fn(),
}));

const removeEmail = _removeEmail as jest.Mock;
const removePhoneNumber = _removePhoneNumber as jest.Mock;
const removeOpenIdIdentifier = _removeOpenIdIdentifier as jest.Mock;

describe("identifierRemoveController", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      data: {
        email: "email",
        identifier: "identifier",
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

    await expect(identifierRemoveController(ctx)).resolves.toStrictEqual({
      data: {},
    });

    expect(removeEmail).toHaveBeenCalled();
  });

  test("should resolve for PHONE_NUMBER", async () => {
    ctx.data.type = IdentifierType.PHONE_NUMBER;

    await expect(identifierRemoveController(ctx)).resolves.toStrictEqual({
      data: {},
    });

    expect(removePhoneNumber).toHaveBeenCalled();
  });

  test("should resolve for OIDC", async () => {
    ctx.data.type = IdentifierType.OIDC;

    await expect(identifierRemoveController(ctx)).resolves.toStrictEqual({
      data: {},
    });

    expect(removeOpenIdIdentifier).toHaveBeenCalled();
  });

  test("should throw on unexpected type", async () => {
    await expect(identifierRemoveController(ctx)).rejects.toThrow(ClientError);
  });
});
